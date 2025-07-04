import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';
import { Producto } from '../productos';

export abstract class ProductoFactory {
  abstract crearProducto(
    articulo: ArticuloBase,
    parametrosEspecificos?: Record<string, any>,
  ): Producto;

  // Método template que define el flujo completo de creación
  public crearProductoCompleto(
    articulo: ArticuloBase,
    parametrosEspecificos?: Record<string, any>,
    productoIngresadoData?: ProductoIngresadoData,
    inventarioData?: Partial<InventarioData>,
  ): Producto {
    // 1. Crear el producto
    const producto = this.crearProducto(articulo, parametrosEspecificos);

    // 2. Validar los datos
    if (!producto.validarDatos()) {
      throw new Error(`Datos inválidos para el producto: ${articulo.nombre}`);
    }

    // 3. Configurar producto ingresado si se proporciona
    if (productoIngresadoData && 'setProductoIngresado' in producto) {
      (producto as any).setProductoIngresado(productoIngresadoData);
    }

    // 4. Configurar inventario
    if (inventarioData) {
      producto.configurarInventario(inventarioData);
    }

    return producto;
  }
}
