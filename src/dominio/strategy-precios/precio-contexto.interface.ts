export interface PrecioContexto {
  tipoCliente?: 'regular' | 'mayorista' | 'premium';
  fechaCompra?: Date;
  historialCompras?: number;
  codigoPromocional?: string;
  cantidadTotalSolicitud?: number;
  temporada?: 'alta' | 'baja' | 'normal';
}
