import { ArticuloBase } from 'src/shared/dto/interface';
import { ProductoFactory } from './producto.factory';
import { ProductosFisicos } from '../productos-fisicos';

export class ProductoFisicoFactory extends ProductoFactory {
  crearProducto(
    articulo: ArticuloBase,
    parametros?: Record<string, any>,
  ): ProductosFisicos {
    return new ProductosFisicos(
      articulo,
      parametros?.dimensiones,
      parametros?.peso,
    );
  }
}
