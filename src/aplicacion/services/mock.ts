import { BaseArticulo } from 'src/dominio/decorator-productos-extencion/base-articulo';

export class MockBaseArticulo extends BaseArticulo {
  precioBase = 100;
  getTotal() {
    return this.precioBase;
  }
  getDetalles() {
    return ['Producto base'];
  }
  getCantidad() {
    return 1;
  }
}

/* export class MockProductoDecorator extends ProductoDecorator {
  getTotal() {
    return 100;
  }
  getDetalles() {
    return ['Decorador base'];
  }
  getCantidad() {
    return 1;
  }
}

export class MockDescuentoDecorator extends DescuentoDecorator {
  getMontoDescuento() {
    return 10;
  }
}

export class MockImpuestoDecorator extends ImpuestoDecorator {
  getMontoImpuesto() {
    return 15;
  }
}

export class MockEnvioGratisDecorator extends EnvioGratisDecorator {
  getCostoEnvio() {
    return 5;
  }
} */
