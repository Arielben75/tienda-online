class EnvioGratisDecorator extends ProductoDecorator {
  private montoMinimoEnvioGratis: number;
  private costoEnvioRegular: number;

  constructor(
    producto: IProducto,
    montoMinimoEnvioGratis: number = 100,
    costoEnvioRegular: number = 10,
  ) {
    super(producto);
    this.montoMinimoEnvioGratis = montoMinimoEnvioGratis;
    this.costoEnvioRegular = costoEnvioRegular;
  }

  getTotal(): number {
    const totalProducto = this.producto.getTotal();
    const tieneEnvioGratis = totalProducto >= this.montoMinimoEnvioGratis;

    return tieneEnvioGratis
      ? totalProducto
      : totalProducto + this.costoEnvioRegular;
  }

  getDetalles(): string[] {
    const detalles = [...this.producto.getDetalles()];
    const totalProducto = this.producto.getTotal();

    if (totalProducto >= this.montoMinimoEnvioGratis) {
      detalles.push(
        '🚚 Envío GRATIS (compra mayor a $' + this.montoMinimoEnvioGratis + ')',
      );
    } else {
      detalles.push(`📦 Costo de envío: $${this.costoEnvioRegular}`);
    }

    return detalles;
  }

  getTieneEnvioGratis(): boolean {
    return this.producto.getTotal() >= this.montoMinimoEnvioGratis;
  }

  getCostoEnvio(): number {
    return this.getTieneEnvioGratis() ? 0 : this.costoEnvioRegular;
  }
}
