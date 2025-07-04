import { ArticuloBase } from 'src/shared/dto/interface';
import { ProductoFactory } from './producto.factory';
import { ProductosPerecederos } from '../productos-perecederos';

export class ProductoPerecederoFactory extends ProductoFactory {
  crearProducto(
    articulo: ArticuloBase,
    parametros?: Record<string, any>,
  ): ProductosPerecederos {
    if (!parametros?.fechaVencimiento || !parametros?.diasVidaUtil) {
      throw new Error(
        'Productos perecibles requieren fechaVencimiento y diasVidaUtil',
      );
    }

    return new ProductosPerecederos(
      articulo,
      parametros.fechaVencimiento,
      parametros.diasVidaUtil,
      parametros.temperaturaAlmacenamiento,
    );
  }
}
