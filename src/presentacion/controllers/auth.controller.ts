import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BearerAuthToken,
  VersionDescription,
} from 'src/presentacion/decorators/controller.decorator';
import {
  CreateUsuariosDto,
  FilterDto,
  UpdateUsuariosDto,
} from '../dtos/usuarios.dto';
import { loginDto } from '../dtos/auth.dto';
import { AuthService } from 'src/aplicacion/services/auth.service';

@ApiTags('[auth] autenticacion'.toUpperCase())
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() body: loginDto) {
    return this.authService.login(body);
  }

  @Post()
  @VersionDescription('1', 'Servico para crear de los Usuarios')
  createUsuarios(@Body() body: CreateUsuariosDto) {
    return this.authService.createUsuarios(body);
  }

  @Patch('/:id')
  @BearerAuthToken()
  @VersionDescription('1', 'Servico para actualizar de los Usuarios')
  updateUsuarios(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: number,
    @Body() body: UpdateUsuariosDto,
  ) {
    return this.authService.updateUsuarios(body, id);
  }

  @Delete('id')
  @BearerAuthToken()
  @VersionDescription('1', 'Servico para eliminar de los Usuarios')
  deleteUsuarios(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: number,
  ) {
    return this.authService.deleteUsuarios(id);
  }

  @Post('list')
  @BearerAuthToken()
  @VersionDescription('1', 'Servico para crear de los Usuarios')
  listadoUsuarios(@Body() body: FilterDto) {
    return this.authService.listUsuarios(body);
  }
}
