import {
  ConfiguracionSolicitud,
  InventarioData,
  SolicitudCompra,
  Usuario,
} from 'src/shared/dto/interface';
import { ISolicitudCompraBuilder } from './solicitud-compra.interface';

export class DirectorSolicitudes {
  private builder: ISolicitudCompraBuilder;

  constructor(builder: ISolicitudCompraBuilder) {
    this.builder = builder;
  }

  // Método para crear una solicitud simple
  crearSolicitudSimple(
    usuario: Usuario,
    productos: Array<{ inventario: InventarioData; cantidad: number }>,
  ): SolicitudCompra {
    return this.builder
      .reset()
      .setUsuario(usuario)
      .setFechaSolicitud(new Date())
      .agregarMultiplesProductos(productos)
      .construir();
  }

  // Método para crear una solicitud con descuento
  crearSolicitudConDescuento(
    usuario: Usuario,
    productos: Array<{ inventario: InventarioData; cantidad: number }>,
    porcentajeDescuento: number,
  ): SolicitudCompra {
    return this.builder
      .reset()
      .setUsuario(usuario)
      .setFechaSolicitud(new Date())
      .agregarMultiplesProductos(productos)
      .aplicarDescuentoPorcentaje(
        porcentajeDescuento,
        `Descuento del ${porcentajeDescuento}%`,
      )
      .construir();
  }

  // Método para crear una solicitud empresarial completa
  crearSolicitudEmpresarial(
    usuario: Usuario,
    productos: Array<{
      inventario: InventarioData;
      cantidad: number;
      precioUnitario?: number;
    }>,
    configuracion?: Partial<ConfiguracionSolicitud>,
  ): SolicitudCompra {
    let builder = this.builder
      .reset()
      .setUsuario(usuario)
      .setFechaSolicitud(new Date());

    if (configuracion) {
      builder = builder.setConfiguracion(configuracion);
    }

    return builder
      .agregarMultiplesProductos(productos)
      .aplicarDescuentoPorcentaje(5, 'Descuento empresarial')
      .construir();
  }
}
