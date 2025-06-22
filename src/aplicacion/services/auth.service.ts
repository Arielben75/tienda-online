import { Injectable } from '@nestjs/common';
import {
  dataResponseError,
  dataResponseSuccess,
  IResponse,
} from 'src/shared/dto/response.dto';
import { loginDto } from '../../presentacion/dtos/auth.dto';
import { PrismaService } from 'src/infraestructura/database/prima.service';
import { compare } from 'bcrypt';
import {
  ApiUnauthorizedError,
  IToken,
} from '../../presentacion/guards/token-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { decode } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import {
  CreateUsuariosDto,
  FilterDto,
  UpdateUsuariosDto,
} from '../../presentacion/dtos/usuarios.dto';

export interface tokenPayload {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  userName: string;
  celular: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly dataBase: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(params: loginDto): Promise<IResponse> {
    try {
      const usuario = await this.dataBase.usuarios.findFirst({
        where: { email: params.email },
      });

      if (!usuario) return dataResponseError('El usuariuo no existe');

      const comparePassword: boolean = await compare(
        params.password,
        String(usuario.password),
      );

      if (!comparePassword)
        return dataResponseError('La contraseña es incorrecta.', {
          status: 401,
        });

      return await this.dataToken({
        id: usuario.id,
        nombres: usuario.nombres,
        primerApellido: usuario.primerApellido,
        segundoApellido: usuario.segundoApellido,
        celular: usuario.celular,
        userName: usuario.userName,
        email: usuario.email,
      });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  async dataToken(payload: tokenPayload): Promise<IResponse> {
    try {
      const [token, tokenRefresh] = await Promise.all([
        this.jwtService.sign(payload, {
          expiresIn: `3600S`,
          secret: process.env.JWT_SECRET, //RECODE verficar el secret_key
        }),
        this.jwtService.sign(payload, { expiresIn: `3600S` }),
      ]);
      return dataResponseSuccess({
        data: {
          token,
          tokenRefresh,
          userName: payload.userName,
          email: payload.email,
        },
      });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  async createUsuarios(params: CreateUsuariosDto): Promise<IResponse> {
    try {
      const verifyPass = this.validatePassword(params.password);
      if (verifyPass) {
        const hashedPassword = await bcrypt.hash(String(params.password), 12);

        const insert = await this.dataBase.usuarios.create({
          data: {
            nombres: params.nombres,
            primerApellido: params.primerApellido,
            segundoApellido: params.segundoApellido,
            fechaNacimiento:
              DateTime.fromJSDate(params.fechaNacimiento).toISODate() ?? '',
            nacionalidad: 'BOLIVIANA',
            email: params.email,
            userName: params.userName,
            password: hashedPassword,
            celular: params.celular,
          },
        });
        return dataResponseSuccess({ data: insert });
      } else {
        return dataResponseError(
          'La contraseña no cumple con los requisitos mínimos de un caracter especial y una letra mayuscula',
        );
      }
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  async updateUsuarios(
    params: UpdateUsuariosDto,
    usuarioId: number,
  ): Promise<IResponse> {
    try {
      const userFind = await this.dataBase.usuarios.findUnique({
        where: { id: usuarioId },
      });
      if (!userFind) {
        return dataResponseError('no Existe el usuario.');
      }
      /* let hashedPassword = userFind.password;
        if (params.password) {
          hashedPassword = await bcrypt.hash(String(params.password), 12);
        } */
      const updateUsuarios = await this.dataBase.usuarios.update({
        where: { id: usuarioId },
        data: {
          nombres: params.nombres,
          primerApellido: params.primerApellido,
          segundoApellido: params.segundoApellido,
          celular: params.celular,
          actualizadoEn: DateTime.now().toISO(),
          email: params.email,
          fechaNacimiento:
            DateTime.fromJSDate(params.fechaNacimiento).toISODate() ?? '',
          nacionalidad: 'BOLIVIANA',
          //password: hashedPassword,
          //userName: params.userName,
        },
      });
      return dataResponseSuccess({ data: updateUsuarios.id });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  async deleteUsuarios(usuarioId: number): Promise<IResponse> {
    try {
      const deleteUser = await this.dataBase.usuarios.delete({
        where: { id: usuarioId },
      });
      return dataResponseSuccess(
        { data: deleteUser },
        { message: 'eliminado Correctamente' },
      );
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  async listUsuarios(filter: FilterDto): Promise<IResponse> {
    try {
      const { size, page, where, orderDirection } = filter;
      let where1: Prisma.UsuariosWhereInput = {};
      const order: { [key: string]: string } = {};
      if (filter.orderBy) order[filter.orderBy] = orderDirection;

      if (where?.celular) {
        where1 = { ...where1, ...{ celular: { contains: where.celular } } };
      }
      if (where?.nombres) {
        where1 = { ...where1, ...{ nombres: { contains: where.nombres } } };
      }
      if (where?.primerApellido) {
        where1 = {
          ...where1,
          ...{ primerApellido: { contains: where.primerApellido } },
        };
      }
      if (where?.segundoApellido) {
        where1 = {
          ...where1,
          ...{ segundoApellido: { contains: where.segundoApellido } },
        };
      }
      if (where?.userName) {
        where1 = { ...where1, ...{ userName: { contains: where.userName } } };
      }

      const listUser = await this.dataBase.usuarios.findMany({
        where: where1,
        select: {
          id: true,
          celular: true,
          email: true,
          nombres: true,
          userName: true,
          primerApellido: true,
          segundoApellido: true,
          nacionalidad: true,
          fechaNacimiento: true,
        },
        orderBy: Object.keys(filter.orderBy ?? {}).length
          ? { [filter.orderBy]: filter.orderDirection }
          : { id: 'desc' },
        skip: size ? (page > 0 ? (filter.page - 1) * size : 0) : undefined,
        take: size,
      });

      return dataResponseSuccess({
        data: listUser,
        pagination: filter?.size
          ? {
              size: filter?.size,
              page: filter.page || 1,
              total: Number(
                await this.dataBase.usuarios.count({ where: where1 }),
              ),
            }
          : undefined,
      });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  validatePassword(pass: any): string {
    let response = pass;
    const reg =
      /(?=^.{8,15}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/;
    response = reg.test(response);
    return response;
  }
}
