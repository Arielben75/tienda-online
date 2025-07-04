import { ArticuloBase } from 'src/shared/dto/interface';
import { PrecioContexto } from './precio-contexto.interface';
import { PrecioCalculado } from './precio-calculado.interface';

export interface IPrecioStrategy {
  calcularPrecio(
    precioBase: number,
    cantidad: number,
    articulo: ArticuloBase,
    contexto?: PrecioContexto,
  ): PrecioCalculado;

  getNombre(): string;
  getDescripcion(): string;
}
