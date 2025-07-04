import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { IObserver, ISubject } from './observer';

export class InventarioSubject implements ISubject {
  private observers: IObserver[] = [];
  private inventarios: Map<number, InventarioData> = new Map();
  private articulos: Map<number, ArticuloBase> = new Map();

  constructor() {}

  // Métodos del patrón Observer
  attach(observer: IObserver): void {
    console.log(`📋 Observer agregado al sistema de inventario`);
    this.observers.push(observer);
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
      console.log(`🗑️ Observer removido del sistema de inventario`);
    }
  }

  notify(
    inventario: InventarioData,
    articulo: ArticuloBase,
    tipoEvento: TipoEventoInventario,
  ): void {
    console.log(
      `🔔 Notificando a ${this.observers.length} observadores sobre: ${tipoEvento}`,
    );
    this.observers.forEach((observer) => {
      observer.update(inventario, articulo, tipoEvento);
    });
  }

  // Métodos de gestión de inventario
  cargarArticulo(articulo: ArticuloBase): void {
    this.articulos.set(articulo.id!, articulo);
  }

  actualizarInventario(inventario: InventarioData): void {
    const inventarioAnterior = this.inventarios.get(inventario.id!);
    this.inventarios.set(inventario.id!, inventario);

    const articulo = this.articulos.get(inventario.articuloId);
    if (!articulo) {
      console.error(
        `❌ Artículo con ID ${inventario.articuloId} no encontrado`,
      );
      return;
    }

    // Lógica de detección de eventos
    this.detectarEventos(inventario, inventarioAnterior, articulo);
  }

  private detectarEventos(
    inventario: InventarioData,
    inventarioAnterior: InventarioData | undefined,
    articulo: ArticuloBase,
  ): void {
    const { cantidad, cantidadMinima } = inventario;

    // Stock agotado
    if (cantidad === 0) {
      this.notify(inventario, articulo, TipoEventoInventario.STOCK_AGOTADO);
      return;
    }

    // Stock bajo (menor que cantidad mínima pero mayor que 0)
    if (cantidad! > 0 && cantidad! <= cantidadMinima) {
      this.notify(inventario, articulo, TipoEventoInventario.STOCK_BAJO);
    }

    // Reabastecimiento necesario (50% por debajo del mínimo)
    if (cantidad! <= cantidadMinima * 0.5) {
      this.notify(
        inventario,
        articulo,
        TipoEventoInventario.REABASTECIMIENTO_NECESARIO,
      );
    }

    // Notificar actualización general si hubo cambios
    if (inventarioAnterior && inventarioAnterior.cantidad !== cantidad) {
      this.notify(inventario, articulo, TipoEventoInventario.STOCK_ACTUALIZADO);
    }
  }

  // Método para obtener inventarios con stock bajo
  getInventariosStockBajo(): InventarioData[] {
    return Array.from(this.inventarios.values()).filter(
      (inv) => inv.cantidad! <= inv.cantidadMinima && inv.cantidad! > 0,
    );
  }

  // Método para obtener inventarios agotados
  getInventariosAgotados(): InventarioData[] {
    return Array.from(this.inventarios.values()).filter(
      (inv) => inv.cantidad === 0,
    );
  }
}
