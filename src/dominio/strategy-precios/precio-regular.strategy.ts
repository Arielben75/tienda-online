import { ArticuloBase } from 'src/shared/dto/interface';
import { IPrecioStrategy } from './precios.strategy.interface';
import { PrecioContexto } from './precio-contexto.interface';
import { PrecioCalculado } from './precio-calculado.interface';

export class PrecioRegularStrategy implements IPrecioStrategy {
  private readonly IVA = 0.16; // 16% IVA

  calcularPrecio(
    precioBase: number,
    cantidad: number,
    articulo: ArticuloBase,
    contexto?: PrecioContexto,
  ): PrecioCalculado {
    const precioConIva = precioBase * (1 + this.IVA);
    const total = precioConIva * cantidad;

    return {
      precioUnitario: Number(precioConIva.toFixed(2)),
      total: Number(total.toFixed(2)),
      descuentoAplicado: 0,
      detalleCalculo: `Precio base: $${precioBase} + IVA (${this.IVA * 100}%) = $${precioConIva.toFixed(2)}`,
      estrategiaUsada: this.getNombre(),
    };
  }

  getNombre(): string {
    return 'Precio Regular';
  }

  getDescripcion(): string {
    return 'Precio estándar con IVA incluido';
  }
}
