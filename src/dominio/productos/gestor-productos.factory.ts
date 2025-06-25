import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';
import { ProductoDigitalFactory } from './factory/producto-digital.factory';
import { ProductoFisicoFactory } from './factory/producto-fisisco.factory';
import { ProductoPerecederoFactory } from './factory/producto-perecedero.factory';
import { ProductoFactory } from './factory/producto.factory';
import { Producto } from './productos';

export class GestorProductosFactory {
  private factories: Map<TipoProducto, ProductoFactory> = new Map();

  constructor() {
    this.factories.set(TipoProducto.FISICO, new ProductoFisicoFactory());
    this.factories.set(TipoProducto.DIGITAL, new ProductoDigitalFactory());
    this.factories.set(TipoProducto.PERECIBLE, new ProductoPerecederoFactory());
  }

  public crearProducto(
    tipo: TipoProducto,
    articulo: ArticuloBase,
    parametrosEspecificos?: Record<string, any>,
    productoIngresadoData?: ProductoIngresadoData,
    inventarioData?: Partial<InventarioData>,
  ): Producto {
    const factory = this.factories.get(tipo);

    if (!factory) {
      throw new Error(`Factory no encontrado para el tipo: ${tipo}`);
    }

    return factory.crearProductoCompleto(
      articulo,
      parametrosEspecificos,
      productoIngresadoData,
      inventarioData,
    );
  }

  public registrarFactory(tipo: TipoProducto, factory: ProductoFactory): void {
    this.factories.set(tipo, factory);
  }
}
