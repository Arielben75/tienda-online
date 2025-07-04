import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { ReabastecimientoObserver } from './creabastecimiento.observer';
import { InventarioSubject } from './inventario-subject';
import { StockBajoObserver } from './stock-bajo.observer';
import { VentasObserver } from './ventas.observer';
import { NotificacionStockBajo } from './notificacion-stock-bajo';
import { SolicitudReabastecimiento } from './solicitud-reabastecimiento';
import { ReporteVentas } from './reporte-ventas';

export class SistemaInventario {
  private inventarioSubject: InventarioSubject;
  private stockBajoObserver: StockBajoObserver;
  private reabastecimientoObserver: ReabastecimientoObserver;
  private ventasObserver: VentasObserver;

  constructor() {
    this.inventarioSubject = new InventarioSubject();
    this.stockBajoObserver = new StockBajoObserver();
    this.reabastecimientoObserver = new ReabastecimientoObserver();
    this.ventasObserver = new VentasObserver();

    this.configurarObservadores();
  }

  private configurarObservadores(): void {
    this.inventarioSubject.attach(this.stockBajoObserver);
    this.inventarioSubject.attach(this.reabastecimientoObserver);
    this.inventarioSubject.attach(this.ventasObserver);
  }

  // Métodos públicos para gestionar el sistema
  cargarArticulo(articulo: ArticuloBase): void {
    this.inventarioSubject.cargarArticulo(articulo);
  }

  actualizarInventario(inventario: InventarioData): void {
    this.inventarioSubject.actualizarInventario(inventario);
  }

  getNotificacionesStockBajo(): NotificacionStockBajo[] {
    return this.stockBajoObserver.getNotificaciones();
  }

  getSolicitudesReabastecimiento(): SolicitudReabastecimiento[] {
    return this.reabastecimientoObserver.getSolicitudes();
  }

  getReportesVentas(): ReporteVentas[] {
    return this.ventasObserver.getReportes();
  }

  getInventariosStockBajo(): InventarioData[] {
    return this.inventarioSubject.getInventariosStockBajo();
  }

  getInventariosAgotados(): InventarioData[] {
    return this.inventarioSubject.getInventariosAgotados();
  }

  // Método para obtener estadísticas del sistema
  getEstadisticas(): any {
    return {
      inventarios: {
        stockBajo: this.getInventariosStockBajo().length,
        agotados: this.getInventariosAgotados().length,
      },
      notificaciones: {
        total: this.getNotificacionesStockBajo().length,
        urgentes: this.getNotificacionesStockBajo().filter((n) => n.esUrgente())
          .length,
      },
      solicitudes: {
        total: this.getSolicitudesReabastecimiento().length,
        pendientes:
          this.reabastecimientoObserver.getSolicitudesPendientes().length,
      },
      reportes: {
        total: this.getReportesVentas().length,
        hoy: this.ventasObserver.getReportesDelDia().length,
      },
    };
  }
}
