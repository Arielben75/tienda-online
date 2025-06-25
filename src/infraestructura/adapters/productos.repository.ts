import { Injectable } from '@nestjs/common';
import { ProductosRepositoryPort } from 'src/dominio/ports/repositories/productos-repository.port';
import { PrismaService } from 'src/infraestructura/database/prima.service';
import { ArticuloBase } from 'src/shared/dto/interface';

@Injectable()
export class ProductosRepository implements ProductosRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findArticulo(): Promise<ArticuloBase> {
    const spaces = await this.prisma.articulos.findFirst({
      where: { estado: 1 },
    });
    return {
      estado: spaces!.estado,
      nombre: spaces!.nombre,
      tipo: spaces!.tipo ?? '',
      actualizadoEn: spaces?.actualizadoEn ?? undefined,
      codigo: spaces?.codigo ?? undefined,
      creadoEn: spaces?.creadoEn ?? undefined,
      descripcion: spaces?.descripcion ?? undefined,
      id: spaces?.id,
    };
  }

  async crearProducto(productoFactory: any): Promise<any> {
    console.log(productoFactory);
    return null;
  }
}
