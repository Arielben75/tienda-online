abstract class ProductoDecorator implements IProducto {
  protected producto: IProducto;

  constructor(producto: IProducto) {
    this.producto = producto;
  }

  getId(): number {
    return this.producto.getId();
  }

  getNombre(): string {
    return this.producto.getNombre();
  }

  getDescripcion(): string {
    return this.producto.getDescripcion();
  }

  getCantidad(): number {
    return this.producto.getCantidad();
  }

  // Métodos que pueden ser sobrescritos por decoradores específicos
  getPrecioUnitario(): number {
    return this.producto.getPrecioUnitario();
  }

  getTotal(): number {
    return this.producto.getTotal();
  }

  getDetalles(): string[] {
    return this.producto.getDetalles();
  }
}
