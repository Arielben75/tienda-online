import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';

export class ReporteVentas {
  public readonly id: string;
  public readonly inventarioId: number;
  public readonly articuloNombre: string;
  public readonly articuloCodigo: string;
  public readonly cantidadAnterior: number;
  public readonly cantidadActual: number;
  public readonly diferencia: number;
  public readonly fechaGeneracion: Date;
  public readonly tipoMovimiento: 'ENTRADA' | 'SALIDA' | 'SIN_CAMBIO';

  constructor(
    inventario: InventarioData,
    articulo: ArticuloBase,
    cantidadAnterior: number = 0,
  ) {
    this.id = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.inventarioId = inventario.id!;
    this.articuloNombre = articulo.nombre;
    this.articuloCodigo = articulo.codigo!;
    this.cantidadAnterior = cantidadAnterior;
    this.cantidadActual = inventario.cantidad!;
    this.diferencia = this.cantidadActual - this.cantidadAnterior;
    this.fechaGeneracion = new Date();
    this.tipoMovimiento = this.determinarTipoMovimiento();
  }

  private determinarTipoMovimiento(): 'ENTRADA' | 'SALIDA' | 'SIN_CAMBIO' {
    if (this.diferencia > 0) return 'ENTRADA';
    if (this.diferencia < 0) return 'SALIDA';
    return 'SIN_CAMBIO';
  }

  generar(): void {
    if (this.tipoMovimiento === 'SIN_CAMBIO') return;

    console.log(`📊 REPORTE DE MOVIMIENTO:`);
    console.log(
      `   📦 Producto: ${this.articuloNombre} (${this.articuloCodigo})`,
    );
    console.log(
      `   📈 Movimiento: ${this.tipoMovimiento} - ${Math.abs(this.diferencia)} unidades`,
    );
    console.log(
      `   📊 Stock: ${this.cantidadAnterior} → ${this.cantidadActual}`,
    );
    console.log(`   🕐 Fecha: ${this.fechaGeneracion.toLocaleString()}`);
    console.log(`   ─────────────────────────────────────────────────────`);
  }
}
