import { InventarioData } from 'src/shared/dto/interface';

export interface ArticuloComponent {
  id: number;
  nombre: string;
  descripcion?: string;

  // Métodos del patrón Composite
  obtenerInventario(): InventarioData[];
  calcularValorTotal(): number;
  buscarPorNombre(nombre: string): ArticuloComponent[];
  mostrarEstructura(nivel?: number): string;

  // Métodos para manejo de hijos (solo para Composite)
  agregar?(componente: ArticuloComponent): void;
  remover?(componente: ArticuloComponent): void;
  obtenerHijos?(): ArticuloComponent[];
}
