import {
  DescuentoAplicado,
  ProductoSolicitado,
} from 'src/shared/dto/interface';

export class CalculadoraPrecios {
  static calcularSubtotal(productos: ProductoSolicitado[]): number {
    return productos.reduce((total, producto) => total + producto.total, 0);
  }

  static aplicarDescuento(
    subtotal: number,
    descuento: DescuentoAplicado,
  ): number {
    switch (descuento.tipo) {
      case TipoDescuento.PORCENTAJE:
        return subtotal * (descuento.valor / 100);
      case TipoDescuento.MONTO_FIJO:
        return Math.min(descuento.valor, subtotal);
      case TipoDescuento.ENVIO_GRATIS:
        return descuento.valor; // Valor fijo del envío
      default:
        return 0;
    }
  }

  static calcularImpuestos(subtotal: number, porcentaje: number): number {
    return subtotal * (porcentaje / 100);
  }

  static calcularTotal(
    subtotal: number,
    descuentos: number,
    impuestos: number,
  ): number {
    return Math.max(0, subtotal - descuentos + impuestos);
  }
}

export class GeneradorCodigos {
  private static contadorSolicitudes = 1000;

  static generarCodigoSolicitud(prefijo: string = 'SOL'): string {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const numero = (++this.contadorSolicitudes).toString().padStart(4, '0');
    return `${prefijo}-${año}${mes}-${numero}`;
  }

  static generarCodigoProducto(
    articuloId: number,
    solicitudId: number,
  ): string {
    return `PROD-${articuloId}-${solicitudId}-${Date.now()}`;
  }
}
