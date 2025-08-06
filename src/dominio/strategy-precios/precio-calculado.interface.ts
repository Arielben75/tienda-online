export interface PrecioCalculado {
  precioUnitario: number;
  total: number;
  detalles?: string;
  descuentoAplicado: number;
  detalleCalculo: string;
  estrategiaUsada: string;
}
