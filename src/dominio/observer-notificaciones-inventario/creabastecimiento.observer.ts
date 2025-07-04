import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { IObserver } from './observer';
import { SolicitudReabastecimiento } from './solicitud-reabastecimiento';

export class ReabastecimientoObserver implements IObserver {
  private solicitudes: SolicitudReabastecimiento[] = [];

  update(
    inventario: InventarioData,
    articulo: ArticuloBase,
    tipoEvento: TipoEventoInventario,
  ): void {
    if (
      tipoEvento === TipoEventoInventario.REABASTECIMIENTO_NECESARIO ||
      tipoEvento === TipoEventoInventario.STOCK_AGOTADO
    ) {
      const solicitud = new SolicitudReabastecimiento(inventario, articulo);
      this.solicitudes.push(solicitud);
      solicitud.crear();
    }
  }

  getSolicitudes(): SolicitudReabastecimiento[] {
    return [...this.solicitudes];
  }

  getSolicitudesPendientes(): SolicitudReabastecimiento[] {
    return this.solicitudes.filter((s) => s.estado === 'PENDIENTE');
  }
}
