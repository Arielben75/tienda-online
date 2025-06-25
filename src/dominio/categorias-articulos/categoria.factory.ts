import { ArticuloLeaf } from './articulo-leaf';
import { CategoriaComposite } from './categoria.composite';

class CategoriaFactory {
  static crearEstructuraEjemplo(): CategoriaComposite {
    // Crear categoría raíz
    const tiendaOnline = new CategoriaComposite(
      1,
      'Tienda Online',
      'Catálogo principal',
    );

    // Crear subcategorías
    const electronica = new CategoriaComposite(
      2,
      'Electrónica',
      'Productos electrónicos',
    );
    const ropa = new CategoriaComposite(3, 'Ropa', 'Vestimenta y accesorios');
    const hogar = new CategoriaComposite(4, 'Hogar', 'Productos para el hogar');

    // Crear subcategorías de electrónica
    const smartphones = new CategoriaComposite(
      5,
      'Smartphones',
      'Teléfonos móviles',
    );
    const laptops = new CategoriaComposite(
      6,
      'Laptops',
      'Computadoras portátiles',
    );

    // Crear artículos
    /* const iphone = new ArticuloLeaf({
      id: 101,
      nombre: 'iPhone 14',
      descripcion: 'Smartphone Apple',
      codigo: 'IP14-001',
      tipo: 'smartphone',
      inventario: { cantidad: 25, cantidadMinima: 5, precioUnitario: 999.99 },
    });

    const samsung = new ArticuloLeaf({
      id: 102,
      nombre: 'Samsung Galaxy S23',
      descripcion: 'Smartphone Samsung',
      codigo: 'SG23-001',
      tipo: 'smartphone',
      inventario: { cantidad: 15, cantidadMinima: 3, precioUnitario: 849.99 },
    });

    const macbook = new ArticuloLeaf({
      id: 103,
      nombre: 'MacBook Air',
      descripcion: 'Laptop Apple',
      codigo: 'MBA-001',
      tipo: 'laptop',
      inventario: { cantidad: 10, cantidadMinima: 2, precioUnitario: 1299.99 },
    });

    const camiseta = new ArticuloLeaf({
      id: 104,
      nombre: 'Camiseta Básica',
      descripcion: 'Camiseta de algodón',
      codigo: 'CAM-001',
      tipo: 'camiseta',
      inventario: { cantidad: 50, cantidadMinima: 10, precioUnitario: 19.99 },
    }); */

    // Construir la jerarquía
    /* smartphones.agregar(iphone);
    smartphones.agregar(samsung);
    laptops.agregar(macbook) */ electronica.agregar(smartphones);
    electronica.agregar(laptops);

    /* ropa.agregar(camiseta); */

    tiendaOnline.agregar(electronica);
    tiendaOnline.agregar(ropa);
    tiendaOnline.agregar(hogar);

    return tiendaOnline;
  }
}
