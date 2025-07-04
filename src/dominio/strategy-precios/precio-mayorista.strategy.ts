import { ArticuloBase } from 'src/shared/dto/interface';
import { PrecioContexto } from './precio-contexto.interface';
import { PrecioCalculado } from './precio-calculado.interface';
import { IPrecioStrategy } from './precios.strategy.interface';

export class PrecioMayoristaStrategy implements IPrecioStrategy {
  private readonly DESCUENTO_MAYORISTA = 0.15; // 15% descuento
  private readonly CANTIDAD_MINIMA_MAYORISTA = 50;
  private readonly IVA = 0.16;

  calcularPrecio(
    precioBase: number,
    cantidad: number,
    articulo: ArticuloBase,
    contexto?: PrecioContexto,
  ): PrecioCalculado {
    let descuentoAplicado = 0;
    let precioConDescuento = precioBase;

    // Aplicar descuento mayorista si cumple condiciones
    if (cantidad >= this.CANTIDAD_MINIMA_MAYORISTA) {
      descuentoAplicado = this.DESCUENTO_MAYORISTA;
      precioConDescuento = precioBase * (1 - descuentoAplicado);
    }

    // Descuento adicional por volumen extra
    if (cantidad >= 100) {
      const descuentoExtra = 0.05; // 5% adicional
      precioConDescuento *= 1 - descuentoExtra;
      descuentoAplicado += descuentoExtra;
    }

    const precioConIva = precioConDescuento * (1 + this.IVA);
    const total = precioConIva * cantidad;

    return {
      precioUnitario: Number(precioConIva.toFixed(2)),
      total: Number(total.toFixed(2)),
      descuentoAplicado: Number((descuentoAplicado * 100).toFixed(1)),
      detalleCalculo: `Precio base: $${precioBase} - Descuento: ${(descuentoAplicado * 100).toFixed(1)}% + IVA: ${this.IVA * 100}%`,
      estrategiaUsada: this.getNombre(),
    };
  }

  getNombre(): string {
    return 'Precio Mayorista';
  }

  getDescripcion(): string {
    return 'Precio con descuentos por volumen para mayoristas';
  }
}
