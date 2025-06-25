import { Producto } from 'src/dominio/productos/productos';
import { ArticuloBase } from 'src/shared/dto/interface';

export interface ProductosRepositoryPort {
  findArticulo(id: number): Promise<ArticuloBase>;
  crearProducto(productoFactory: any): Promise<any>;
}
