import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';
import { Producto } from './productos';

export class ProductosDigitales extends Producto {
  private urlDescarga?: string;
  private tamanoArchivo?: number; // en MB
  private formatoArchivo?: string;
  private licenciaTipo?: 'UNICA' | 'MULTIPLE' | 'ILIMITADA';

  constructor(
    articulo: ArticuloBase,
    urlDescarga?: string,
    tamanoArchivo?: number,
    formatoArchivo?: string,
    licenciaTipo: 'UNICA' | 'MULTIPLE' | 'ILIMITADA' = 'UNICA',
  ) {
    super(articulo);
    this.urlDescarga = urlDescarga;
    this.tamanoArchivo = tamanoArchivo;
    this.formatoArchivo = formatoArchivo;
    this.licenciaTipo = licenciaTipo;
  }

  validarDatos(): boolean {
    return !!(this.articulo.nombre && this.urlDescarga);
  }

  configurarInventario(inventarioData: Partial<InventarioData>): void {
    // Los productos digitales tienen inventario "ilimitado" por defecto
    this.inventario = {
      articuloId: this.articulo.id!,
      cantidadMinima: 0,
      cantidad: inventarioData.cantidad || 999999,
      esVisibleMp: inventarioData.esVisibleMp ?? true,
      cantidadOficial: inventarioData.cantidadOficial || 999999,
      unidadMedidaId: inventarioData.unidadMedidaId,
      ...inventarioData,
    };
  }

  calcularPrecioFinal(): number {
    const precioBase = this.productoIngresado?.precioUnitario || 0;
    const descuentoDigital = this.calcularDescuentoDigital();
    return precioBase - descuentoDigital;
  }

  private calcularDescuentoDigital(): number {
    // Los productos digitales pueden tener descuentos por no tener costos físicos
    const precioBase = this.productoIngresado?.precioUnitario || 0;
    return precioBase * 0.05; // 5% de descuento por ser digital
  }

  obtenerInformacionEspecifica(): Record<string, any> {
    return {
      tipo: TipoProducto.DIGITAL,
      urlDescarga: this.urlDescarga,
      tamanoArchivo: this.tamanoArchivo,
      formatoArchivo: this.formatoArchivo,
      licenciaTipo: this.licenciaTipo,
      descuentoDigital: this.calcularDescuentoDigital(),
    };
  }

  setProductoIngresado(data: ProductoIngresadoData): void {
    this.productoIngresado = data;
  }
}
