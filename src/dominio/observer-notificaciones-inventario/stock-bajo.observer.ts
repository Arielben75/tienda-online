import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { NotificacionStockBajo } from './notificacion-stock-bajo';
import { IObserver } from './observer';

export class StockBajoObserver implements IObserver {
  private notificaciones: NotificacionStockBajo[] = [];

  update(
    inventario: InventarioData,
    articulo: ArticuloBase,
    tipoEvento: TipoEventoInventario,
  ): void {
    if (
      tipoEvento === TipoEventoInventario.STOCK_BAJO ||
      tipoEvento === TipoEventoInventario.STOCK_AGOTADO
    ) {
      const notificacion = new NotificacionStockBajo(
        inventario,
        articulo,
        tipoEvento,
      );
      this.notificaciones.push(notificacion);
      notificacion.procesar();
    }
  }

  getNotificaciones(): NotificacionStockBajo[] {
    return [...this.notificaciones];
  }

  limpiarNotificaciones(): void {
    this.notificaciones = [];
  }
}
