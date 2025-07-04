import {
  ConfiguracionSolicitud,
  DescuentoAplicado,
  InventarioData,
  ProductoSolicitado,
  SolicitudCompra,
  Usuario,
} from 'src/shared/dto/interface';
import { ISolicitudCompraBuilder } from './solicitud-compra.interface';
import { CalculadoraPrecios, GeneradorCodigos } from './clases-apoyo';
import {
  SolicitudBuilderError,
  StockInsuficienteError,
  UsuarioInvalidoError,
} from './excepciones';
import { ValidadorSolicitud } from './validaciones';

class SolicitudCompraBuilder implements ISolicitudCompraBuilder {
  private solicitud: Partial<SolicitudCompra> = {};
  private productos: ProductoSolicitado[] = [];
  private descuentos: DescuentoAplicado[] = [];
  private configuracion: ConfiguracionSolicitud = {
    aplicarImpuestos: true,
    porcentajeImpuesto: 13, // IVA Bolivia
    permitirStockNegativo: false,
    validarDisponibilidad: true,
    generarCodigoAutomatico: true,
  };
  private usuario?: Usuario;

  constructor() {
    this.reset();
  }

  setUsuario(usuario: Usuario): ISolicitudCompraBuilder {
    if (!ValidadorSolicitud.validarUsuario(usuario)) {
      throw new UsuarioInvalidoError(usuario.id);
    }
    this.usuario = usuario;
    this.solicitud.usuarioId = usuario.id;
    return this;
  }

  setFechaSolicitud(fecha: Date): ISolicitudCompraBuilder {
    if (!ValidadorSolicitud.validarFecha(fecha)) {
      throw new SolicitudBuilderError(
        'Fecha de solicitud inválida',
        'FECHA_INVALIDA',
      );
    }
    this.solicitud.fechaSolicitud = fecha;
    return this;
  }

  setFechaCompra(fecha: Date): ISolicitudCompraBuilder {
    if (!ValidadorSolicitud.validarFecha(fecha)) {
      throw new SolicitudBuilderError(
        'Fecha de compra inválida',
        'FECHA_INVALIDA',
      );
    }
    this.solicitud.fechaCompra = fecha;
    return this;
  }

  setFechaFacturacion(fecha: Date): ISolicitudCompraBuilder {
    if (!ValidadorSolicitud.validarFecha(fecha)) {
      throw new SolicitudBuilderError(
        'Fecha de facturación inválida',
        'FECHA_INVALIDA',
      );
    }
    this.solicitud.fechaFacturacion = fecha;
    return this;
  }

  setCodigo(codigo: string): ISolicitudCompraBuilder {
    if (!codigo || codigo.trim().length === 0) {
      throw new SolicitudBuilderError(
        'Código de solicitud no puede estar vacío',
        'CODIGO_INVALIDO',
      );
    }
    this.solicitud.codigo = codigo.trim();
    return this;
  }

  setConfiguracion(
    config: Partial<ConfiguracionSolicitud>,
  ): ISolicitudCompraBuilder {
    this.configuracion = { ...this.configuracion, ...config };
    return this;
  }

  agregarProducto(
    inventario: InventarioData,
    cantidad: number,
    precioUnitario?: number,
  ): ISolicitudCompraBuilder {
    // Validar inventario y disponibilidad
    if (
      !ValidadorSolicitud.validarInventario(
        inventario,
        cantidad,
        this.configuracion.permitirStockNegativo,
      )
    ) {
      throw new StockInsuficienteError(
        inventario.articulos?.nombre || 'Producto desconocido',
        inventario.cantidad!,
        cantidad,
      );
    }

    // Verificar si el producto ya existe en la solicitud
    const productoExistente = this.productos.find(
      (p) => p.articuloId === inventario.articuloId,
    );

    if (productoExistente) {
      // Actualizar cantidad del producto existente
      const nuevaCantidad = productoExistente.cantidad + cantidad;

      if (
        !this.configuracion.permitirStockNegativo &&
        inventario.cantidad! < nuevaCantidad
      ) {
        throw new StockInsuficienteError(
          inventario.articulos?.nombre || 'Producto desconocido',
          inventario.cantidad!,
          nuevaCantidad,
        );
      }

      productoExistente.cantidad = nuevaCantidad;
      productoExistente.total =
        productoExistente.cantidad * productoExistente.precioUnitario;
    } else {
      // Agregar nuevo producto
      const precio = precioUnitario || this.calcularPrecioSugerido(inventario);

      const nuevoProducto: ProductoSolicitado = {
        articuloId: inventario.articuloId,
        inventarioId: inventario.id!,
        cantidad: cantidad,
        precioUnitario: precio,
        total: cantidad * precio,
        estado: 1,
      };

      this.productos.push(nuevoProducto);
    }

    return this;
  }

  agregarMultiplesProductos(
    productos: Array<{
      inventario: InventarioData;
      cantidad: number;
      precioUnitario?: number;
    }>,
  ): ISolicitudCompraBuilder {
    productos.forEach(({ inventario, cantidad, precioUnitario }) => {
      this.agregarProducto(inventario, cantidad, precioUnitario);
    });
    return this;
  }

  modificarCantidadProducto(
    articuloId: number,
    nuevaCantidad: number,
  ): ISolicitudCompraBuilder {
    const producto = this.productos.find((p) => p.articuloId === articuloId);

    if (!producto) {
      throw new SolicitudBuilderError(
        `Producto con ID ${articuloId} no encontrado en la solicitud`,
        'PRODUCTO_NO_ENCONTRADO',
      );
    }

    if (nuevaCantidad <= 0) {
      return this.eliminarProducto(articuloId);
    }

    producto.cantidad = nuevaCantidad;
    producto.total = producto.cantidad * producto.precioUnitario;

    return this;
  }

  eliminarProducto(articuloId: number): ISolicitudCompraBuilder {
    const indice = this.productos.findIndex((p) => p.articuloId === articuloId);

    if (indice === -1) {
      throw new SolicitudBuilderError(
        `Producto con ID ${articuloId} no encontrado en la solicitud`,
        'PRODUCTO_NO_ENCONTRADO',
      );
    }

    this.productos.splice(indice, 1);
    return this;
  }

  aplicarDescuento(descuento: DescuentoAplicado): ISolicitudCompraBuilder {
    // Validar descuento
    if (descuento.valor <= 0) {
      throw new SolicitudBuilderError(
        'El valor del descuento debe ser mayor a 0',
        'DESCUENTO_INVALIDO',
      );
    }

    if (descuento.tipo === TipoDescuento.PORCENTAJE && descuento.valor > 100) {
      throw new SolicitudBuilderError(
        'El porcentaje de descuento no puede ser mayor a 100%',
        'DESCUENTO_INVALIDO',
      );
    }

    this.descuentos.push(descuento);
    return this;
  }

  aplicarDescuentoPorcentaje(
    porcentaje: number,
    descripcion: string,
  ): ISolicitudCompraBuilder {
    return this.aplicarDescuento({
      tipo: TipoDescuento.PORCENTAJE,
      valor: porcentaje,
      descripcion: descripcion,
      aplicaATodo: true,
    });
  }

  aplicarDescuentoMontoFijo(
    monto: number,
    descripcion: string,
  ): ISolicitudCompraBuilder {
    return this.aplicarDescuento({
      tipo: TipoDescuento.MONTO_FIJO,
      valor: monto,
      descripcion: descripcion,
      aplicaATodo: true,
    });
  }

  establecerEstado(estado: EstadoSolicitud): ISolicitudCompraBuilder {
    this.solicitud.estado = estado;
    return this;
  }

  marcarComoCerrada(): ISolicitudCompraBuilder {
    this.solicitud.esSolicitudCerrada = true;
    return this;
  }

  validar(): boolean {
    // Validar usuario
    if (!this.usuario || !this.solicitud.usuarioId) {
      throw new SolicitudBuilderError(
        'Usuario requerido para crear la solicitud',
        'USUARIO_REQUERIDO',
      );
    }

    // Validar fecha de solicitud
    if (!this.solicitud.fechaSolicitud) {
      throw new SolicitudBuilderError(
        'Fecha de solicitud requerida',
        'FECHA_REQUERIDA',
      );
    }

    // Validar que tenga al menos un producto
    if (this.productos.length === 0) {
      throw new SolicitudBuilderError(
        'La solicitud debe tener al menos un producto',
        'PRODUCTOS_REQUERIDOS',
      );
    }

    // Validar que todos los productos tengan cantidades válidas
    const productosInvalidos = this.productos.filter(
      (p) => p.cantidad <= 0 || p.precioUnitario < 0,
    );
    if (productosInvalidos.length > 0) {
      throw new SolicitudBuilderError(
        'Todos los productos deben tener cantidad y precio válidos',
        'PRODUCTOS_INVALIDOS',
      );
    }

    return true;
  }

  calcularTotales(): void {
    const subtotal = CalculadoraPrecios.calcularSubtotal(this.productos);

    // Calcular descuentos
    const totalDescuentos = this.descuentos.reduce((total, descuento) => {
      return total + CalculadoraPrecios.aplicarDescuento(subtotal, descuento);
    }, 0);

    // Calcular impuestos
    const totalImpuestos = this.configuracion.aplicarImpuestos
      ? CalculadoraPrecios.calcularImpuestos(
          subtotal - totalDescuentos,
          this.configuracion.porcentajeImpuesto,
        )
      : 0;

    // Calcular total final
    const montoFinal = CalculadoraPrecios.calcularTotal(
      subtotal,
      totalDescuentos,
      totalImpuestos,
    );

    this.solicitud.montoTotalSolicitado = montoFinal;
    this.solicitud.montoTotalCompra = montoFinal; // Inicialmente son iguales
  }

  construir(): SolicitudCompra {
    // Validar antes de construir
    this.validar();

    // Calcular totales
    this.calcularTotales();

    // Generar código si es necesario
    if (this.configuracion.generarCodigoAutomatico && !this.solicitud.codigo) {
      this.solicitud.codigo = GeneradorCodigos.generarCodigoSolicitud();
    }

    // Establecer valores por defecto
    const solicitudFinal: SolicitudCompra = {
      codigo: this.solicitud.codigo,
      usuarioId: this.solicitud.usuarioId!,
      fechaSolicitud: this.solicitud.fechaSolicitud!,
      fechaCompra: this.solicitud.fechaCompra,
      fechaFacturacion: this.solicitud.fechaFacturacion,
      montoTotalSolicitado: this.solicitud.montoTotalSolicitado!,
      montoTotalCompra: this.solicitud.montoTotalCompra!,
      esSolicitudCerrada: this.solicitud.esSolicitudCerrada || false,
      estado: this.solicitud.estado || EstadoSolicitud.PENDIENTE,
      creadoEn: new Date(),
      usuario: this.usuario,
      productosSolicitados: [...this.productos],
    };

    return solicitudFinal;
  }

  reset(): ISolicitudCompraBuilder {
    this.solicitud = {};
    this.productos = [];
    this.descuentos = [];
    this.usuario = undefined;
    this.configuracion = {
      aplicarImpuestos: true,
      porcentajeImpuesto: 13,
      permitirStockNegativo: false,
      validarDisponibilidad: true,
      generarCodigoAutomatico: true,
    };
    return this;
  }

  // Métodos auxiliares privados
  private calcularPrecioSugerido(inventario: InventarioData): number {
    // Lógica para calcular precio sugerido basado en el inventario
    // Esto es un ejemplo, puedes implementar tu propia lógica
    return 10.0; // Precio base ejemplo
  }

  // Métodos para obtener información del estado actual (útiles para debugging)
  obtenerResumen(): any {
    const subtotal = CalculadoraPrecios.calcularSubtotal(this.productos);
    const totalDescuentos = this.descuentos.reduce((total, descuento) => {
      return total + CalculadoraPrecios.aplicarDescuento(subtotal, descuento);
    }, 0);

    return {
      usuario: this.usuario?.nombres + ' ' + this.usuario?.primerApellido,
      totalProductos: this.productos.length,
      subtotal: subtotal,
      descuentos: totalDescuentos,
      productos: this.productos.map((p) => ({
        articuloId: p.articuloId,
        cantidad: p.cantidad,
        precio: p.precioUnitario,
        total: p.total,
      })),
      descuentosAplicados: this.descuentos,
    };
  }
}
