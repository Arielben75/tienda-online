interface IProducto {
  getId(): number;
  getNombre(): string;
  getDescripcion(): string;
  getPrecioUnitario(): number;
  getCantidad(): number;
  getTotal(): number;
  getDetalles(): string[];
}
