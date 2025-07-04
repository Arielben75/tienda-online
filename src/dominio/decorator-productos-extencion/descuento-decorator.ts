class DescuentoDecorator extends ProductoDecorator {
  private porcentajeDescuento: number;
  private tipoDescuento: string;

  constructor(
    producto: IProducto,
    porcentajeDescuento: number,
    tipoDescuento: string = 'general',
  ) {
    super(producto);
    this.porcentajeDescuento = Math.max(0, Math.min(100, porcentajeDescuento)); // Entre 0 y 100
    this.tipoDescuento = tipoDescuento;
  }

  getPrecioUnitario(): number {
    const precioBase = this.producto.getPrecioUnitario();
    const descuento = precioBase * (this.porcentajeDescuento / 100);
    return precioBase - descuento;
  }

  getTotal(): number {
    return this.getPrecioUnitario() * this.getCantidad();
  }

  getDetalles(): string[] {
    const detalles = [...this.producto.getDetalles()];
    detalles.push(
      `Descuento ${this.tipoDescuento}: -${this.porcentajeDescuento}%`,
    );
    return detalles;
  }

  getMontoDescuento(): number {
    const precioOriginal = this.producto.getPrecioUnitario();
    const precioConDescuento = this.getPrecioUnitario();
    return (precioOriginal - precioConDescuento) * this.getCantidad();
  }
}
