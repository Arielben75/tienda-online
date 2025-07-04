import { ArticuloBase } from 'src/shared/dto/interface';
import { IPrecioStrategy } from './precios.strategy.interface';
import { PrecioContexto } from './precio-contexto.interface';
import { PrecioCalculado } from './precio-calculado.interface';

export class PrecioContext {
  private estrategia: IPrecioStrategy;

  constructor(estrategia: IPrecioStrategy) {
    this.estrategia = estrategia;
  }

  // Método para cambiar la estrategia dinámicamente
  setEstrategia(estrategia: IPrecioStrategy): void {
    this.estrategia = estrategia;
  }

  // Método principal para calcular precio
  calcularPrecio(
    precioBase: number,
    cantidad: number,
    articulo: ArticuloBase,
    contexto?: PrecioContexto,
  ): PrecioCalculado {
    return this.estrategia.calcularPrecio(
      precioBase,
      cantidad,
      articulo,
      contexto,
    );
  }

  // Obtener información de la estrategia actual
  getEstrategiaActual(): { nombre: string; descripcion: string } {
    return {
      nombre: this.estrategia.getNombre(),
      descripcion: this.estrategia.getDescripcion(),
    };
  }
}
