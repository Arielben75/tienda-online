import { ArticuloBase } from 'src/shared/dto/interface';
import { PrecioContexto } from './precio-contexto.interface';
import { PrecioCalculado } from './precio-calculado.interface';
import { IPrecioStrategy } from './precios.strategy.interface';

export class PrecioPromocionalStrategy implements IPrecioStrategy {
  private readonly PROMOCIONES: Map<string, number> = new Map([
    ['VERANO2024', 0.2],
    ['NAVIDAD', 0.25],
    ['CYBER', 0.3],
    ['BLACKFRIDAY', 0.35],
  ]);
  private readonly IVA = 0.16;

  calcularPrecio(
    precioBase: number,
    cantidad: number,
    articulo: ArticuloBase,
    contexto?: PrecioContexto,
  ): PrecioCalculado {
    let descuentoAplicado = 0;
    let codigoUsado = '';

    // Verificar código promocional
    if (contexto?.codigoPromocional) {
      const descuentoPromo = this.PROMOCIONES.get(contexto.codigoPromocional);
      if (descuentoPromo) {
        descuentoAplicado = descuentoPromo;
        codigoUsado = contexto.codigoPromocional;
      }
    }

    // Descuento por temporada
    if (contexto?.temporada === 'baja') {
      descuentoAplicado = Math.max(descuentoAplicado, 0.1); // Mínimo 10% en temporada baja
    }

    // Descuento por cliente premium
    if (contexto?.tipoCliente === 'premium') {
      descuentoAplicado += 0.05; // 5% adicional para premium
    }

    const precioConDescuento = precioBase * (1 - descuentoAplicado);
    const precioConIva = precioConDescuento * (1 + this.IVA);
    const total = precioConIva * cantidad;

    const detalle = codigoUsado
      ? `Código: ${codigoUsado}, Descuento: ${(descuentoAplicado * 100).toFixed(1)}%`
      : `Descuento promocional: ${(descuentoAplicado * 100).toFixed(1)}%`;

    return {
      precioUnitario: Number(precioConIva.toFixed(2)),
      total: Number(total.toFixed(2)),
      descuentoAplicado: Number((descuentoAplicado * 100).toFixed(1)),
      detalleCalculo: detalle,
      estrategiaUsada: this.getNombre(),
    };
  }

  getNombre(): string {
    return 'Precio Promocional';
  }

  getDescripcion(): string {
    return 'Precio con descuentos promocionales y códigos especiales';
  }
}
