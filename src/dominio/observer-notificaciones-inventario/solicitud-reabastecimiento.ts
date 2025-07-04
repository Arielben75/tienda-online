import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';

export class SolicitudReabastecimiento {
  public readonly id: string;
  public readonly inventarioId: number;
  public readonly articuloId: number;
  public readonly articuloNombre: string;
  public readonly articuloCodigo: string;
  public readonly cantidadActual: number;
  public readonly cantidadMinima: number;
  public readonly cantidadSugerida: number;
  public readonly fechaCreacion: Date;
  public estado: 'PENDIENTE' | 'PROCESADA' | 'COMPLETADA' = 'PENDIENTE';

  constructor(inventario: InventarioData, articulo: ArticuloBase) {
    this.id = `REAB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.inventarioId = inventario.id!;
    this.articuloId = articulo.id!;
    this.articuloNombre = articulo.nombre;
    this.articuloCodigo = articulo.codigo!;
    this.cantidadActual = inventario.cantidad!;
    this.cantidadMinima = inventario.cantidadMinima;
    this.cantidadSugerida = this.calcularCantidadSugerida();
    this.fechaCreacion = new Date();
  }

  private calcularCantidadSugerida(): number {
    // Sugerir el doble del mínimo menos la cantidad actual
    const sugerida = this.cantidadMinima * 2 - this.cantidadActual;
    return Math.max(sugerida, this.cantidadMinima);
  }

  crear(): void {
    console.log(`🔄 SOLICITUD DE REABASTECIMIENTO CREADA:`);
    console.log(
      `   📦 Producto: ${this.articuloNombre} (${this.articuloCodigo})`,
    );
    console.log(
      `   📊 Stock actual: ${this.cantidadActual} | Mínimo: ${this.cantidadMinima}`,
    );
    console.log(`   📈 Cantidad sugerida: ${this.cantidadSugerida}`);
    console.log(`   🆔 ID Solicitud: ${this.id}`);
    console.log(`   ─────────────────────────────────────────────────────`);
  }

  procesar(): void {
    this.estado = 'PROCESADA';
    console.log(`✅ Solicitud ${this.id} procesada`);
  }

  completar(): void {
    this.estado = 'COMPLETADA';
    console.log(`✅ Solicitud ${this.id} completada`);
  }
}
