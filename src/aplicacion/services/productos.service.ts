import { Inject, Injectable } from '@nestjs/common';
import { ProductosRepositoryPort } from 'src/dominio/ports/repositories/productos-repository.port';
import { GestorProductosFactory } from 'src/dominio/productos/gestor-productos.factory';
import {
  dataResponseError,
  dataResponseFormat,
  dataResponseSuccess,
  ResponseDTO,
} from 'src/shared/dto/response.dto';

@Injectable()
export class ProductosService {
  constructor(
    @Inject('ProductosRepositoryPort')
    private readonly productosRepository: ProductosRepositoryPort,
  ) {}

  async createPrductos(params: {
    articuloId: number;
    parametrosEspecificos?: Record<string, any>;
    cantidad: number;
    precioUnitario: number;
    cantidadMinima: number;
    esVisibleMp: boolean;
    fechaIngreso: Date;
  }): Promise<ResponseDTO<any>> {
    try {
      const productosFactory = new GestorProductosFactory();

      const articulo = await this.productosRepository.findArticulo(
        params.articuloId,
      );

      const producto = productosFactory.crearProducto(
        TipoProducto[articulo.tipo],
        articulo,
        params.parametrosEspecificos,
        {
          cantidad: params.cantidad,
          precioUnitario: params.precioUnitario,
          totalIngreso: params.precioUnitario * params.cantidad,
          fechaIngreso: params.fechaIngreso,
        },
        {
          cantidadMinima: params.cantidadMinima,
          cantidad: params.cantidad,
          esVisibleMp: params.esVisibleMp,
        },
      );

      const productoCreado =
        await this.productosRepository.crearProducto(producto);

      return dataResponseSuccess({ data: productoCreado });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }
}
