class ImpuestoDecorator extends ProductoDecorator {
  private porcentajeImpuesto: number;
  private tipoImpuesto: string;

  constructor(
    producto: IProducto,
    porcentajeImpuesto: number,
    tipoImpuesto: string = 'IVA',
  ) {
    super(producto);
    this.porcentajeImpuesto = Math.max(0, porcentajeImpuesto);
    this.tipoImpuesto = tipoImpuesto;
  }

  getPrecioUnitario(): number {
    const precioBase = this.producto.getPrecioUnitario();
    const impuesto = precioBase * (this.porcentajeImpuesto / 100);
    return precioBase + impuesto;
  }

  getTotal(): number {
    return this.getPrecioUnitario() * this.getCantidad();
  }

  getDetalles(): string[] {
    const detalles = [...this.producto.getDetalles()];
    detalles.push(`${this.tipoImpuesto}: +${this.porcentajeImpuesto}%`);
    return detalles;
  }

  getMontoImpuesto(): number {
    const precioSinImpuesto = this.producto.getPrecioUnitario();
    const impuesto = precioSinImpuesto * (this.porcentajeImpuesto / 100);
    return impuesto * this.getCantidad();
  }
}
