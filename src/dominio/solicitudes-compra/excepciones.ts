export class SolicitudBuilderError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = 'SolicitudBuilderError';
  }
}

export class StockInsuficienteError extends SolicitudBuilderError {
  constructor(articuloNombre: string, disponible: number, solicitado: number) {
    super(
      `Stock insuficiente para ${articuloNombre}. Disponible: ${disponible}, Solicitado: ${solicitado}`,
      'STOCK_INSUFICIENTE',
    );
  }
}

export class UsuarioInvalidoError extends SolicitudBuilderError {
  constructor(usuarioId: number) {
    super(
      `Usuario con ID ${usuarioId} no existe o está inactivo`,
      'USUARIO_INVALIDO',
    );
  }
}
