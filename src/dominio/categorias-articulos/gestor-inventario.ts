import { InventarioData } from 'src/shared/dto/interface';
import { ArticuloComponent } from './articulos-component.interface';

export class GestorInventario {
  constructor(private categoriaRaiz: ArticuloComponent) {}

  // Obtener resumen de inventario
  obtenerResumenInventario(): {
    totalArticulos: number;
    valorTotal: number;
    articulosBajoStock: InventarioData[];
  } {
    const inventarios = this.categoriaRaiz.obtenerInventario();
    const articulosBajoStock = inventarios.filter(
      (item) => item.cantidad! <= item.cantidadMinima,
    );

    return {
      totalArticulos: inventarios.length,
      valorTotal: this.categoriaRaiz.calcularValorTotal(),
      articulosBajoStock,
    };
  }

  // Buscar artículos por nombre
  buscarArticulos(termino: string): ArticuloComponent[] {
    return this.categoriaRaiz.buscarPorNombre(termino);
  }

  // Obtener estructura completa
  mostrarEstructuraCompleta(): string {
    return this.categoriaRaiz.mostrarEstructura();
  }

  // Generar reporte de inventario
  generarReporte(): string {
    const resumen = this.obtenerResumenInventario();
    let reporte = '=== REPORTE DE INVENTARIO ===\n\n';

    reporte += `Total de artículos: ${resumen.totalArticulos}\n`;
    reporte += `Valor total del inventario: $${resumen.valorTotal.toFixed(2)}\n`;
    reporte += `Artículos bajo stock: ${resumen.articulosBajoStock.length}\n\n`;

    if (resumen.articulosBajoStock.length > 0) {
      reporte += 'ARTÍCULOS QUE REQUIEREN REPOSICIÓN:\n';
      reporte += '---------------------------------------\n';
      resumen.articulosBajoStock.forEach((item) => {
        reporte += `• ${item.articuloId}: ${item.cantidad}/${item.cantidadMinima} unidades\n`;
      });
      reporte += '\n';
    }

    reporte += 'ESTRUCTURA DE CATEGORÍAS:\n';
    reporte += '-------------------------\n';
    reporte += this.mostrarEstructuraCompleta();

    return reporte;
  }
}
