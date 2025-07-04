import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';
import { Producto } from './productos';

export class ProductosPerecederos extends Producto {
  private fechaVencimiento: Date;
  private temperaturaAlmacenamiento?: { min: number; max: number };
  private diasVidaUtil: number;

  constructor(
    articulo: ArticuloBase,
    fechaVencimiento: Date,
    diasVidaUtil: number,
    temperaturaAlmacenamiento?: { min: number; max: number },
  ) {
    super(articulo);
    this.fechaVencimiento = fechaVencimiento;
    this.diasVidaUtil = diasVidaUtil;
    this.temperaturaAlmacenamiento = temperaturaAlmacenamiento;
  }

  validarDatos(): boolean {
    const fechaActual = new Date();
    return !!(
      this.articulo.nombre &&
      this.articulo.codigo &&
      this.fechaVencimiento > fechaActual
    );
  }

  configurarInventario(inventarioData: Partial<InventarioData>): void {
    // Los productos perecibles necesitan un manejo especial del inventario
    this.inventario = {
      articuloId: this.articulo.id!,
      cantidadMinima: inventarioData.cantidadMinima || 5,
      cantidad: inventarioData.cantidad || 0,
      esVisibleMp: this.estaVigente(),
      cantidadOficial: inventarioData.cantidadOficial || 0,
      unidadMedidaId: inventarioData.unidadMedidaId,
      ...inventarioData,
    };
  }

  calcularPrecioFinal(): number {
    const precioBase = this.productoIngresado?.precioUnitario || 0;
    const descuentoVencimiento = this.calcularDescuentoPorVencimiento();
    return precioBase - descuentoVencimiento;
  }

  private calcularDescuentoPorVencimiento(): number {
    const fechaActual = new Date();
    const diasRestantes = Math.ceil(
      (this.fechaVencimiento.getTime() - fechaActual.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const precioBase = this.productoIngresado?.precioUnitario || 0;

    if (diasRestantes <= 2) return precioBase * 0.3; // 30% descuento
    if (diasRestantes <= 5) return precioBase * 0.2; // 20% descuento
    if (diasRestantes <= 10) return precioBase * 0.1; // 10% descuento
    return 0;
  }

  private estaVigente(): boolean {
    return this.fechaVencimiento > new Date();
  }

  obtenerInformacionEspecifica(): Record<string, any> {
    const fechaActual = new Date();
    const diasRestantes = Math.ceil(
      (this.fechaVencimiento.getTime() - fechaActual.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return {
      tipo: TipoProducto.PERECIBLE,
      fechaVencimiento: this.fechaVencimiento,
      diasVidaUtil: this.diasVidaUtil,
      diasRestantes: diasRestantes,
      temperaturaAlmacenamiento: this.temperaturaAlmacenamiento,
      estaVigente: this.estaVigente(),
      descuentoVencimiento: this.calcularDescuentoPorVencimiento(),
    };
  }

  setProductoIngresado(data: ProductoIngresadoData): void {
    // Asegurar que la fecha de vencimiento del producto ingresado coincida
    this.productoIngresado = {
      ...data,
      fechaVencimiento: this.fechaVencimiento,
    };
  }
}
