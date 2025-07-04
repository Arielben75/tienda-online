import { ArticuloBase, InventarioData } from 'src/shared/dto/interface';
import { ArticuloComponent } from './articulos-component.interface';

export class ArticuloLeaf implements ArticuloComponent {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo: string;
  tipo: string;
  private inventario?: {
    cantidad: number;
    cantidadMinima: number;
    precioUnitario: number;
  };

  constructor(articulo: ArticuloBase) {
    this.id = articulo.id!;
    this.nombre = articulo.nombre;
    this.descripcion = articulo.descripcion;
    this.codigo = articulo.codigo!;
    this.tipo = articulo.tipo;
    this.inventario = articulo.inventario;
  }

  obtenerInventario(): InventarioData[] {
    if (!this.inventario) return [];

    return [
      {
        articuloId: this.id,
        cantidad: this.inventario.cantidad,
        cantidadMinima: this.inventario.cantidadMinima,
        esVisibleMp: true,
        //precioUnitario: this.inventario.precioUnitario,
        //valorTotal: this.inventario.cantidad * this.inventario.precioUnitario
      },
    ];
  }

  calcularValorTotal(): number {
    if (!this.inventario) return 0;
    return this.inventario.cantidad * this.inventario.precioUnitario;
  }

  buscarPorNombre(nombre: string): ArticuloComponent[] {
    return this.nombre.toLowerCase().includes(nombre.toLowerCase())
      ? [this]
      : [];
  }

  mostrarEstructura(nivel: number = 0): string {
    const indent = '  '.repeat(nivel);
    const stock = this.inventario
      ? `(Stock: ${this.inventario.cantidad})`
      : '(Sin stock)';
    return `${indent}📦 ${this.nombre} ${stock}`;
  }
}
