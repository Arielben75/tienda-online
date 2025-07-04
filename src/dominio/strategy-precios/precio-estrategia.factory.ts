import { PrecioMayoristaStrategy } from './precio-mayorista.strategy';
import { PrecioPromocionalStrategy } from './precio-promocional.strategy';
import { PrecioRegularStrategy } from './precio-regular.strategy';
import { IPrecioStrategy } from './precios.strategy.interface';

export class EstrategiaPrecioFactory {
  private static estrategias: Map<string, IPrecioStrategy>;

  // Inicializar estrategias en un método estático
  private static inicializarEstrategias(): void {
    if (!this.estrategias) {
      this.estrategias = new Map<string, IPrecioStrategy>();
      this.estrategias.set('regular', new PrecioRegularStrategy());
      this.estrategias.set('mayorista', new PrecioMayoristaStrategy());
      this.estrategias.set('promocional', new PrecioPromocionalStrategy());
    }
  }

  static crearEstrategia(tipo: string): IPrecioStrategy {
    this.inicializarEstrategias();
    const estrategia = this.estrategias.get(tipo.toLowerCase());
    if (!estrategia) {
      throw new Error(`Estrategia de precio '${tipo}' no encontrada`);
    }
    return estrategia;
  }

  static obtenerEstrategiasDisponibles(): string[] {
    this.inicializarEstrategias();
    return Array.from(this.estrategias.keys());
  }

  // Método para agregar nuevas estrategias dinámicamente
  static registrarEstrategia(
    nombre: string,
    estrategia: IPrecioStrategy,
  ): void {
    this.inicializarEstrategias();
    this.estrategias.set(nombre.toLowerCase(), estrategia);
  }
}
