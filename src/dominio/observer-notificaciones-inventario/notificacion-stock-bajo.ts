import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';

export class NotificacionStockBajo {
  public readonly id: string;
  public readonly inventarioId: number;
  public readonly articuloNombre: string;
  public readonly articuloCodigo: string;
  public readonly cantidadActual: number;
  public readonly cantidadMinima: number;
  public readonly tipoEvento: TipoEventoInventario;
  public readonly fechaCreacion: Date;
  public procesada: boolean = false;

  constructor(
    inventario: InventarioData,
    articulo: ArticuloBase,
    tipoEvento: TipoEventoInventario,
  ) {
    this.id = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.inventarioId = inventario.id!;
    this.articuloNombre = articulo.nombre;
    this.articuloCodigo = articulo.codigo!;
    this.cantidadActual = inventario.cantidad!;
    this.cantidadMinima = inventario.cantidadMinima;
    this.tipoEvento = tipoEvento;
    this.fechaCreacion = new Date();
  }

  procesar(): void {
    console.log(`🚨 ALERTA: ${this.tipoEvento}`);
    console.log(
      `   📦 Producto: ${this.articuloNombre} (${this.articuloCodigo})`,
    );
    console.log(
      `   📊 Stock actual: ${this.cantidadActual} | Mínimo requerido: ${this.cantidadMinima}`,
    );
    console.log(`   🕐 Fecha: ${this.fechaCreacion.toLocaleString()}`);
    console.log(`   ─────────────────────────────────────────────────────`);
    this.procesada = true;
  }

  esUrgente(): boolean {
    return (
      this.tipoEvento === TipoEventoInventario.STOCK_AGOTADO ||
      this.cantidadActual <= this.cantidadMinima * 0.3
    );
  }
}
