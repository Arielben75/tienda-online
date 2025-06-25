import {
  ArticuloBase,
  InventarioData,
  ProductoIngresadoData,
} from 'src/shared/dto/interface';

export abstract class Producto {
  protected articulo: ArticuloBase;
  protected productoIngresado?: ProductoIngresadoData;
  protected inventario?: InventarioData;

  constructor(articulo: ArticuloBase) {
    this.articulo = articulo;
  }

  // Métodos comunes
  getId(): number | undefined {
    return this.articulo.id;
  }

  getNombre(): string {
    return this.articulo.nombre;
  }

  getDescripcion(): string | undefined {
    return this.articulo.descripcion;
  }

  getCodigo(): string | undefined {
    return this.articulo.codigo;
  }

  // Métodos abstractos que deben implementar las clases hijas
  abstract validarDatos(): boolean;
  abstract configurarInventario(inventarioData: Partial<InventarioData>): void;
  abstract calcularPrecioFinal(): number;
  abstract obtenerInformacionEspecifica(): Record<string, any>;
}
