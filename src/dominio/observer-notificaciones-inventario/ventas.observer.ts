import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { IObserver } from './observer';
import { ReporteVentas } from './reporte-ventas';

export class VentasObserver implements IObserver {
  private reportes: ReporteVentas[] = [];

  update(
    inventario: InventarioData,
    articulo: ArticuloBase,
    tipoEvento: TipoEventoInventario,
  ): void {
    if (tipoEvento === TipoEventoInventario.STOCK_ACTUALIZADO) {
      const reporte = new ReporteVentas(inventario, articulo);
      this.reportes.push(reporte);
      reporte.generar();
    }
  }

  getReportes(): ReporteVentas[] {
    return [...this.reportes];
  }

  getReportesDelDia(): ReporteVentas[] {
    const hoy = new Date();
    return this.reportes.filter(
      (r) => r.fechaGeneracion.toDateString() === hoy.toDateString(),
    );
  }
}
