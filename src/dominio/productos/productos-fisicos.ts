import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';
import { Producto } from './productos';

export class ProductosFisicos extends Producto {
  private dimensiones?: { largo: number; ancho: number; alto: number };
  private peso?: number;
  private requiereAlmacenamiento: boolean = true;

  constructor(
    articulo: ArticuloBase,
    dimensiones?: { largo: number; ancho: number; alto: number },
    peso?: number,
  ) {
    super(articulo);
    this.dimensiones = dimensiones;
    this.peso = peso;
  }

  validarDatos(): boolean {
    return !!(this.articulo.nombre && this.articulo.codigo);
  }

  configurarInventario(inventarioData: Partial<InventarioData>): void {
    this.inventario = {
      articuloId: this.articulo.id!,
      cantidadMinima: inventarioData.cantidadMinima || 10,
      cantidad: inventarioData.cantidad || 0,
      esVisibleMp: inventarioData.esVisibleMp ?? true,
      cantidadOficial: inventarioData.cantidadOficial || 0,
      unidadMedidaId: inventarioData.unidadMedidaId,
      ...inventarioData,
    };
  }

  calcularPrecioFinal(): number {
    const precioBase = this.productoIngresado?.precioUnitario || 0;
    const costoAlmacenamiento = this.calcularCostoAlmacenamiento();
    return precioBase + costoAlmacenamiento;
  }

  private calcularCostoAlmacenamiento(): number {
    if (!this.dimensiones || !this.peso) return 0;
    const volumen =
      this.dimensiones.largo * this.dimensiones.ancho * this.dimensiones.alto;
    return volumen * 0.001 + this.peso * 0.1; // Fórmula ejemplo
  }

  obtenerInformacionEspecifica(): Record<string, any> {
    return {
      tipo: TipoProducto.FISICO,
      dimensiones: this.dimensiones,
      peso: this.peso,
      requiereAlmacenamiento: this.requiereAlmacenamiento,
      costoAlmacenamiento: this.calcularCostoAlmacenamiento(),
    };
  }

  setProductoIngresado(data: ProductoIngresadoData): void {
    this.productoIngresado = data;
  }
}
