import { InventarioData } from 'src/shared/dto/interface';
import { ArticuloComponent } from './articulos-component.interface';
import { ArticuloLeaf } from './articulo-leaf';

export class CategoriaComposite implements ArticuloComponent {
  id: number;
  nombre: string;
  descripcion?: string;
  private hijos: ArticuloComponent[] = [];

  constructor(id: number, nombre: string, descripcion?: string) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  // Métodos de gestión de hijos
  agregar(componente: ArticuloComponent): void {
    this.hijos.push(componente);
  }

  remover(componente: ArticuloComponent): void {
    const index = this.hijos.findIndex((hijo) => hijo.id === componente.id);
    if (index > -1) {
      this.hijos.splice(index, 1);
    }
  }

  obtenerHijos(): ArticuloComponent[] {
    return [...this.hijos];
  }

  // Implementación de métodos del patrón Composite
  obtenerInventario(): InventarioData[] {
    const inventarios: InventarioData[] = [];

    for (const hijo of this.hijos) {
      inventarios.push(...hijo.obtenerInventario());
    }

    return inventarios;
  }

  calcularValorTotal(): number {
    return this.hijos.reduce(
      (total, hijo) => total + hijo.calcularValorTotal(),
      0,
    );
  }

  buscarPorNombre(nombre: string): ArticuloComponent[] {
    let resultados: ArticuloComponent[] = [];

    // Buscar en el nombre de la categoría
    if (this.nombre.toLowerCase().includes(nombre.toLowerCase())) {
      resultados.push(this);
    }

    // Buscar en todos los hijos
    for (const hijo of this.hijos) {
      resultados.push(...hijo.buscarPorNombre(nombre));
    }

    return resultados;
  }

  mostrarEstructura(nivel: number = 0): string {
    const indent = '  '.repeat(nivel);
    let resultado = `${indent}📁 ${this.nombre} (${this.hijos.length} elementos)`;

    for (const hijo of this.hijos) {
      resultado += '\n' + hijo.mostrarEstructura(nivel + 1);
    }

    return resultado;
  }

  // Métodos auxiliares para estadísticas
  contarArticulos(): number {
    return this.hijos.reduce((count, hijo) => {
      if (hijo instanceof ArticuloLeaf) {
        return count + 1;
      } else if (hijo instanceof CategoriaComposite) {
        return count + hijo.contarArticulos();
      }
      return count;
    }, 0);
  }

  contarCategorias(): number {
    return this.hijos.reduce((count, hijo) => {
      if (hijo instanceof CategoriaComposite) {
        return count + 1 + hijo.contarCategorias();
      }
      return count;
    }, 0);
  }
}
