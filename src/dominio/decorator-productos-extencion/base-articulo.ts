import { ArticuloBase } from 'src/shared/dto/interface';

export class BaseArticulo implements IProducto {
  protected articulo: ArticuloBase;
  protected cantidad: number;
  protected precioBase: number;

  constructor(articulo: ArticuloBase, cantidad: number, precioBase: number) {
    this.articulo = articulo;
    this.cantidad = cantidad;
    this.precioBase = precioBase;
  }

  getId(): number {
    return this.articulo.id!;
  }

  getNombre(): string {
    return this.articulo.nombre;
  }

  getDescripcion(): string {
    return this.articulo.descripcion || '';
  }

  getPrecioUnitario(): number {
    return this.precioBase;
  }

  getCantidad(): number {
    return this.cantidad;
  }

  getTotal(): number {
    return this.precioBase * this.cantidad;
  }

  getDetalles(): string[] {
    return [`Producto base: ${this.getNombre()}`];
  }
}
