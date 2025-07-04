import { ArticuloBase } from 'src/shared/dto/interface';
import { BaseArticulo } from './base-articulo';

export class ProductoDecoradorFactory {
  static crearProductoConDescuento(
    articulo: ArticuloBase,
    cantidad: number,
    precioBase: number,
    porcentajeDescuento: number,
    tipoDescuento: string = 'general',
  ): DescuentoDecorator {
    const baseProducto = new BaseArticulo(articulo, cantidad, precioBase);
    return new DescuentoDecorator(
      baseProducto,
      porcentajeDescuento,
      tipoDescuento,
    );
  }

  static crearProductoCompleto(
    articulo: ArticuloBase,
    cantidad: number,
    precioBase: number,
    configuracion: {
      descuento?: { porcentaje: number; tipo: string };
      impuesto?: { porcentaje: number; tipo: string };
      envioGratis?: { montoMinimo: number; costoRegular: number };
      promocion?: {
        nombre: string;
        descuentoFijo: number;
        cantidadMinima: number;
      };
    },
  ): IProducto {
    let producto: IProducto = new BaseArticulo(articulo, cantidad, precioBase);

    // Aplicar descuento si está configurado
    if (configuracion.descuento) {
      producto = new DescuentoDecorator(
        producto,
        configuracion.descuento.porcentaje,
        configuracion.descuento.tipo,
      );
    }

    // Aplicar impuesto si está configurado
    if (configuracion.impuesto) {
      producto = new ImpuestoDecorator(
        producto,
        configuracion.impuesto.porcentaje,
        configuracion.impuesto.tipo,
      );
    }

    // Aplicar promoción especial si está configurada
    if (configuracion.promocion) {
      producto = new PromocionEspecialDecorator(
        producto,
        configuracion.promocion.nombre,
        configuracion.promocion.descuentoFijo,
        configuracion.promocion.cantidadMinima,
      );
    }

    // Aplicar envío gratis si está configurado (se aplica al final)
    if (configuracion.envioGratis) {
      producto = new EnvioGratisDecorator(
        producto,
        configuracion.envioGratis.montoMinimo,
        configuracion.envioGratis.costoRegular,
      );
    }

    return producto;
  }
}
