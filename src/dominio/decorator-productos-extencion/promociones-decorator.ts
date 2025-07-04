class PromocionEspecialDecorator extends ProductoDecorator {
  private nombrePromocion: string;
  private descuentoFijo: number;
  private cantidadMinima: number;

  constructor(
    producto: IProducto,
    nombrePromocion: string,
    descuentoFijo: number,
    cantidadMinima: number = 1,
  ) {
    super(producto);
    this.nombrePromocion = nombrePromocion;
    this.descuentoFijo = Math.max(0, descuentoFijo);
    this.cantidadMinima = Math.max(1, cantidadMinima);
  }

  getTotal(): number {
    const totalBase = this.producto.getTotal();
    const aplicaPromocion = this.getCantidad() >= this.cantidadMinima;

    return aplicaPromocion
      ? Math.max(0, totalBase - this.descuentoFijo)
      : totalBase;
  }

  getDetalles(): string[] {
    const detalles = [...this.producto.getDetalles()];

    if (this.getCantidad() >= this.cantidadMinima) {
      detalles.push(`🎉 ${this.nombrePromocion}: -$${this.descuentoFijo}`);
    } else {
      detalles.push(
        `⏳ ${this.nombrePromocion} disponible (mín. ${this.cantidadMinima} unidades)`,
      );
    }

    return detalles;
  }

  getAplicaPromocion(): boolean {
    return this.getCantidad() >= this.cantidadMinima;
  }
}
