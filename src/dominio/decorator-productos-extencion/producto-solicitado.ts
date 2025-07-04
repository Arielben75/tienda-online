import { ProductoSolicitado } from 'src/shared/dto/interface';
import { BaseArticulo } from './base-articulo';

class ProductoSolicitadoService {
  /**
   * Convierte un producto decorado a los datos necesarios para ProductosSolicitados
   */
  static convertirAProductoSolicitado(
    producto: IProducto,
    solicitudCompraId: number,
    inventarioId: number,
  ): Omit<ProductoSolicitado, 'id'> {
    return {
      articuloId: producto.getId(),
      solicitudCompraId,
      inventarioId,
      cantidad: producto.getCantidad(),
      precioUnitario: producto.getPrecioUnitario(),
      total: producto.getTotal(),
    };
  }

  /**
   * Calcula el resumen de precios de un producto decorado
   */
  static obtenerResumenPrecios(producto: IProducto): {
    precioBase: number;
    precioFinal: number;
    totalDescuentos: number;
    totalImpuestos: number;
    costoEnvio: number;
    detalles: string[];
  } {
    let precioBase = 0;
    let totalDescuentos = 0;
    let totalImpuestos = 0;
    let costoEnvio = 0;

    // Recorrer los decoradores para obtener información detallada
    let productoActual = producto;

    // Buscar el BaseArticulo para obtener el precio original
    while (productoActual instanceof ProductoDecorator) {
      if (productoActual instanceof DescuentoDecorator) {
        totalDescuentos += productoActual.getMontoDescuento();
      } else if (productoActual instanceof ImpuestoDecorator) {
        totalImpuestos += productoActual.getMontoImpuesto();
      } else if (productoActual instanceof EnvioGratisDecorator) {
        costoEnvio = productoActual.getCostoEnvio();
      }

      productoActual = (productoActual as any).producto;
    }

    if (productoActual instanceof BaseArticulo) {
      precioBase = (productoActual as any).precioBase * producto.getCantidad();
    }

    return {
      precioBase,
      precioFinal: producto.getTotal(),
      totalDescuentos,
      totalImpuestos,
      costoEnvio,
      detalles: producto.getDetalles(),
    };
  }
}
