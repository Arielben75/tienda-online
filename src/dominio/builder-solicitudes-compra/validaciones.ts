import { InventarioData, Usuario } from 'src/shared/dto/interface';

export class ValidadorSolicitud {
  static validarUsuario(usuario: Usuario): boolean {
    if (usuario && usuario.estado === 1 && usuario.email && usuario.userName)
      return true;
    else return false;
  }

  static validarInventario(
    inventario: InventarioData,
    cantidadSolicitada: number,
    permitirStockNegativo: boolean,
  ): boolean {
    if (!permitirStockNegativo && inventario.cantidad! < cantidadSolicitada) {
      return false;
    }
    return inventario.esVisibleMp && inventario.articulos?.estado === 1;
  }

  static validarFecha(fecha: Date): boolean {
    return (
      fecha instanceof Date && !isNaN(fecha.getTime()) && fecha >= new Date()
    );
  }
}
