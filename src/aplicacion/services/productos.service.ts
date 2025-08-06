import { Inject, Injectable } from '@nestjs/common';
import { BaseArticulo } from 'src/dominio/decorator-productos-extencion/base-articulo';
import { GestorProductosFactory } from 'src/dominio/factory-productos/gestor-productos.factory';
import { ProductosRepositoryPort } from 'src/dominio/ports/repositories/productos-repository.port';
import { PrecioCalculado } from 'src/dominio/strategy-precios/precio-calculado.interface';
import { PrecioContexto } from 'src/dominio/strategy-precios/precio-contexto.interface';
import { EstrategiaPrecioFactory } from 'src/dominio/strategy-precios/precio-estrategia.factory';

import { PrecioRegularStrategy } from 'src/dominio/strategy-precios/precio-regular.strategy';
import { PrecioContext } from 'src/dominio/strategy-precios/precio.context';
import { IPrecioStrategy } from 'src/dominio/strategy-precios/precios.strategy.interface';
import { ArticuloBase, ProductoSolicitado } from 'src/shared/dto/interface';
import {
  dataResponseError,
  dataResponseSuccess,
  ResponseDTO,
} from 'src/shared/dto/response.dto';

@Injectable()
export class ProductosService {
  private precioContext: PrecioContext;

  constructor(
    @Inject('ProductosRepositoryPort')
    private readonly productosRepository: ProductosRepositoryPort,
    private readonly estrategiaInicial: IPrecioStrategy = new PrecioRegularStrategy(),
  ) {
    this.precioContext = new PrecioContext(estrategiaInicial);
  }

  static convertirAProductoSolicitado(
    producto: IProducto,
    solicitudCompraId: number,
    inventarioId: number,
  ): Omit<ProductoSolicitado, 'id'> {
    return {
      articuloId: producto.getId(),
      solicitudCompraId,
      inventarioId,
      cantidad: producto.getCantidad(),
      precioUnitario: producto.getPrecioUnitario(),
      total: producto.getTotal(),
    };
  }

  async createPrductos(params: {
    articuloId: number;
    parametrosEspecificos?: Record<string, any>;
    cantidad: number;
    precioUnitario: number;
    cantidadMinima: number;
    esVisibleMp: boolean;
    fechaIngreso: Date;
  }): Promise<ResponseDTO<any>> {
    try {
      const productosFactory = new GestorProductosFactory();

      const articulo = await this.productosRepository.findArticulo(
        params.articuloId,
      );

      const producto = productosFactory.crearProducto(
        TipoProducto[articulo.tipo],
        articulo,
        params.parametrosEspecificos,
        {
          cantidad: params.cantidad,
          precioUnitario: params.precioUnitario,
          totalIngreso: params.precioUnitario * params.cantidad,
          fechaIngreso: params.fechaIngreso,
        },
        {
          cantidadMinima: params.cantidadMinima,
          cantidad: params.cantidad,
          esVisibleMp: params.esVisibleMp,
        },
      );

      const productoCreado =
        await this.productosRepository.crearProducto(producto);

      return dataResponseSuccess({ data: productoCreado });
    } catch (error) {
      return dataResponseError(error.message);
    }
  }

  calcularPrecioProducto(
    articuloId: number,
    cantidad: number,
    precioBase: number,
    articulo: ArticuloBase,
    tipoEstrategia: string,
    contexto?: PrecioContexto,
  ): ProductoSolicitado {
    // Cambiar estrategia según el tipo solicitado
    const estrategia = EstrategiaPrecioFactory.crearEstrategia(tipoEstrategia);
    this.precioContext.setEstrategia(estrategia);

    // Calcular precio
    const resultado = this.precioContext.calcularPrecio(
      precioBase,
      cantidad,
      articulo,
      contexto,
    );

    // Crear objeto ProductoSolicitado (simulando inserción en BD)
    const productoSolicitado: ProductoSolicitado = {
      id: 0, // Se asignaría automáticamente en la BD
      articuloId: articuloId,
      solicitudCompraId: 0, // Se asignaría al crear la solicitud
      inventarioId: 0, // Se obtendría del inventario
      cantidad: cantidad,
      precioUnitario: resultado.precioUnitario,
      total: resultado.total,
      estado: 1,
    };

    return productoSolicitado;
  }

  calcularTotalSolicitud(
    productos: Array<{
      articuloId: number;
      cantidad: number;
      precioBase: number;
      articulo: ArticuloBase;
      tipoEstrategia: string;
    }>,
    contextoGlobal?: PrecioContexto,
  ): {
    productos: ProductoSolicitado[];
    montoTotal: number;
    detalles: PrecioCalculado[];
  } {
    const productosCalculados: ProductoSolicitado[] = [];
    const detalles: PrecioCalculado[] = [];
    let montoTotal = 0;

    productos.forEach((producto) => {
      const productoSolicitado = this.calcularPrecioProducto(
        producto.articuloId,
        producto.cantidad,
        producto.precioBase,
        producto.articulo,
        producto.tipoEstrategia,
        contextoGlobal,
      );

      // Obtener detalles del cálculo
      const estrategia = EstrategiaPrecioFactory.crearEstrategia(
        producto.tipoEstrategia,
      );
      const detalle = estrategia.calcularPrecio(
        producto.precioBase,
        producto.cantidad,
        producto.articulo,
        contextoGlobal,
      );

      productosCalculados.push(productoSolicitado);
      detalles.push(detalle);
      montoTotal += productoSolicitado.total;
    });

    return {
      productos: productosCalculados,
      montoTotal: Number(montoTotal.toFixed(2)),
      detalles,
    };
  }

  /**
   * Calcula el resumen de precios de un producto decorado
   */
  obtenerResumenPrecios(producto: IProducto): {
    precioBase: number;
    precioFinal: number;
    totalDescuentos: number;
    totalImpuestos: number;
    costoEnvio: number;
    detalles: string[];
  } {
    let precioBase = 0;
    let totalDescuentos = 0;
    let totalImpuestos = 0;
    let costoEnvio = 0;

    // Recorrer los decoradores para obtener información detallada
    let productoActual = producto;

    // Buscar el BaseArticulo para obtener el precio original
    while (productoActual instanceof ProductoDecorator) {
      if (productoActual instanceof DescuentoDecorator) {
        totalDescuentos += productoActual.getMontoDescuento();
      } else if (productoActual instanceof ImpuestoDecorator) {
        totalImpuestos += productoActual.getMontoImpuesto();
      } else if (productoActual instanceof EnvioGratisDecorator) {
        costoEnvio = productoActual.getCostoEnvio();
      }

      productoActual = (productoActual as any).producto;
    }

    if (productoActual instanceof BaseArticulo) {
      precioBase = (productoActual as any).precioBase * producto.getCantidad();
    }

    return {
      precioBase,
      precioFinal: producto.getTotal(),
      totalDescuentos,
      totalImpuestos,
      costoEnvio,
      detalles: producto.getDetalles(),
    };
  }
}
