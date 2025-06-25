export interface IPackageJson {
  name: string;
  version: string;
  description: string;
  author: string;
  contact: {
    name: string;
    url: string;
    email: string;
  };
  license: string;
}

export interface UserPayload {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  celular: string;
  userName: string;
  iat: number;
  exp: number;
}

export interface ArticuloBase {
  id?: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  tipo: string;
  estado: number;
  creadoEn?: Date;
  actualizadoEn?: Date;
  inventario?: {
    cantidad: number;
    cantidadMinima: number;
    precioUnitario: number;
  };
}

export interface ProductoIngresadoData {
  articuloId?: number;
  cantidad?: number;
  unidadMedidaId?: number;
  cantidadIngresada?: number;
  cantidadEgresada?: number;
  precioUnitario?: number;
  totalIngreso?: number;
  fechaIngreso?: Date;
  fechaFacturacion?: Date;
  fechaVencimiento?: Date;
}

export interface InventarioData {
  id?: number;
  articuloId: number;
  unidadMedidaId?: number;
  cantidadMinima: number;
  cantidad?: number;
  esVisibleMp: boolean;
  cantidadOficial?: number;
  articulos?: ArticuloBase;
}

export interface Usuario {
  id: number;
  nombres: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  email: string;
  userName: string;
  celular: string;
  estado: number;
}

export interface ProductoSolicitado {
  id?: number;
  articuloId: number;
  solicitudCompraId?: number;
  inventarioId: number;
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado?: number;
  creadoEn?: Date;
  actualizadoEn?: Date;
}

export interface SolicitudCompra {
  id?: number;
  codigo?: string;
  usuarioId: number;
  fechaSolicitud: Date;
  fechaCompra?: Date;
  fechaFacturacion?: Date;
  montoTotalSolicitado: number;
  montoTotalCompra: number;
  esSolicitudCerrada: boolean;
  estado?: number;
  creadoEn?: Date;
  actualizadoEn?: Date;
  usuario?: Usuario;
  productosSolicitados?: ProductoSolicitado[];
}

export interface DescuentoAplicado {
  tipo: TipoDescuento;
  valor: number;
  descripcion: string;
  aplicaATodo?: boolean;
  articulosEspecificos?: number[];
}

export interface ConfiguracionSolicitud {
  aplicarImpuestos: boolean;
  porcentajeImpuesto: number;
  permitirStockNegativo: boolean;
  validarDisponibilidad: boolean;
  generarCodigoAutomatico: boolean;
}
