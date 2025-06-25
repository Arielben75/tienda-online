import { ArticuloBase } from 'src/shared/dto/interface';
import { ProductoFactory } from './producto.factory';
import { ProductosDigitales } from '../productos-digitales';

export class ProductoDigitalFactory extends ProductoFactory {
  crearProducto(
    articulo: ArticuloBase,
    parametros?: Record<string, any>,
  ): ProductosDigitales {
    return new ProductosDigitales(
      articulo,
      parametros?.urlDescarga,
      parametros?.tamanoArchivo,
      parametros?.formatoArchivo,
      parametros?.licenciaTipo,
    );
  }
}
