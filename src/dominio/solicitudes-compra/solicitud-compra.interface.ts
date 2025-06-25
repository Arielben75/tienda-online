import {
  ConfiguracionSolicitud,
  DescuentoAplicado,
  InventarioData,
  SolicitudCompra,
  Usuario,
} from 'src/shared/dto/interface';

export interface ISolicitudCompraBuilder {
  setUsuario(usuario: Usuario): ISolicitudCompraBuilder;
  setFechaSolicitud(fecha: Date): ISolicitudCompraBuilder;
  setFechaCompra(fecha: Date): ISolicitudCompraBuilder;
  setFechaFacturacion(fecha: Date): ISolicitudCompraBuilder;
  setCodigo(codigo: string): ISolicitudCompraBuilder;
  setConfiguracion(
    config: Partial<ConfiguracionSolicitud>,
  ): ISolicitudCompraBuilder;

  agregarProducto(
    inventario: InventarioData,
    cantidad: number,
    precioUnitario?: number,
  ): ISolicitudCompraBuilder;
  agregarMultiplesProductos(
    productos: Array<{
      inventario: InventarioData;
      cantidad: number;
      precioUnitario?: number;
    }>,
  ): ISolicitudCompraBuilder;
  modificarCantidadProducto(
    articuloId: number,
    nuevaCantidad: number,
  ): ISolicitudCompraBuilder;
  eliminarProducto(articuloId: number): ISolicitudCompraBuilder;

  aplicarDescuento(descuento: DescuentoAplicado): ISolicitudCompraBuilder;
  aplicarDescuentoPorcentaje(
    porcentaje: number,
    descripcion: string,
  ): ISolicitudCompraBuilder;
  aplicarDescuentoMontoFijo(
    monto: number,
    descripcion: string,
  ): ISolicitudCompraBuilder;

  establecerEstado(estado: EstadoSolicitud): ISolicitudCompraBuilder;
  marcarComoCerrada(): ISolicitudCompraBuilder;

  validar(): boolean;
  calcularTotales(): void;
  construir(): SolicitudCompra;
  reset(): ISolicitudCompraBuilder;
}
