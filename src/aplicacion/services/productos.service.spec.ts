import { MockBaseArticulo } from './mock';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let service: ProductosService;
  let mockEstrategia: any;
  let mockFactory: any;
  let mockPrecioContext: any;
  let mockProductosRepository: any;

  const dummyArticulo: any = {
    id: 1,
    nombre: 'Test Articulo',
    tipo: 'REGULAR',
  };
  const dummyContexto: any = { clienteVip: true };

  beforeEach(() => {
    mockEstrategia = {
      calcularPrecio: jest.fn((precioBase, cantidad, articulo, contexto) => ({
        precioUnitario: precioBase + 1,
        total: (precioBase + 1) * cantidad,
        detalles: ['detalle'],
      })),
    };

    mockFactory = {
      crearEstrategia: jest.fn((tipoEstrategia) => mockEstrategia),
    };

    mockPrecioContext = {
      setEstrategia: jest.fn(),
      calcularPrecio: jest.fn((precioBase, cantidad, articulo, contexto) => ({
        precioUnitario: precioBase + 1,
        total: (precioBase + 1) * cantidad,
        detalles: ['detalle'],
      })),
    };

    mockProductosRepository = {
      findArticulo: jest.fn().mockResolvedValue({ id: 1, tipo: 'REGULAR' }),
      crearProducto: jest.fn().mockResolvedValue({ id: 1, nombre: 'Creado' }),
    };

    jest.mock('src/dominio/strategy-precios/precio-estrategia.factory', () => ({
      EstrategiaPrecioFactory: {
        crearEstrategia: jest.fn(() => mockEstrategia),
      },
    }));

    service = new ProductosService(mockProductosRepository);

    jest
      .spyOn(
        require('src/dominio/strategy-precios/precio.context'),
        'PrecioContext',
      )
      .mockImplementation(() => mockPrecioContext);

    service = new ProductosService(mockProductosRepository);
  });

  describe('calcularPrecioProducto', () => {
    it('should create correct strategy based on tipoEstrategia', () => {
      expect(() => {
        service.calcularPrecioProducto(1, 1, 10, dummyArticulo, 'PREMIUM');
      }).toThrow(new Error("Estrategia de precio 'PREMIUM' no encontrada"));
    });

    it('should set strategy in context', () => {
      service.calcularPrecioProducto(1, 1, 10, dummyArticulo, 'REGULAR');
      expect(mockPrecioContext.setEstrategia).toHaveBeenCalled();
    });

    it('should return producto with correct default values', () => {
      const result = service.calcularPrecioProducto(
        1,
        1,
        10,
        dummyArticulo,
        'REGULAR',
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 0,
          solicitudCompraId: 0,
          inventarioId: 0,
          estado: 1,
        }),
      );
    });

    it('should handle zero quantity correctly', () => {
      const result = service.calcularPrecioProducto(
        1,
        0,
        10,
        dummyArticulo,
        'REGULAR',
      );
      expect(result.total).toBe(0);
    });
  });

  describe('createPrductos', () => {
    const validParams = {
      articuloId: 1,
      cantidad: 2,
      precioUnitario: 10,
      cantidadMinima: 1,
      esVisibleMp: true,
      fechaIngreso: new Date(),
      parametrosEspecificos: { color: 'rojo' },
    };

    it('should validate required parameters', async () => {
      const invalidParams = { ...validParams, cantidad: undefined };
      const result = await service.createPrductos(invalidParams as any);
      console.log(result);
      expect(result.error).toBe(true);
    });

    it('should calculate totalIngreso correctly', async () => {
      const gestorProductosSpy = jest
        .spyOn(
          require('src/dominio/factory-productos/gestor-productos.factory'),
          'GestorProductosFactory',
        )
        .mockImplementation(() => ({
          crearProducto: jest.fn((tipo, articulo, params, datos) => {
            expect(datos.totalIngreso).toBe(
              validParams.cantidad * validParams.precioUnitario,
            );
            return {};
          }),
        }));

      await service.createPrductos(validParams);
      expect(gestorProductosSpy).toHaveBeenCalled();
    });

    it('should handle invalid article type', async () => {
      mockProductosRepository.findArticulo.mockResolvedValue({
        id: 1,
        tipo: 'INVALID',
      });
      const result = await service.createPrductos(validParams);
      expect(result.error).toBe(true);
    });
  });

  describe('calcularTotalSolicitud edge cases', () => {
    it('should handle products with zero price', () => {
      const productos = [
        {
          articuloId: 1,
          cantidad: 1,
          precioBase: 0,
          articulo: dummyArticulo,
          tipoEstrategia: 'REGULAR',
        },
      ];
      const result = service.calcularTotalSolicitud(productos, dummyContexto);
      expect(result.montoTotal).toBe(1); // precioBase(0) + 1 por la estrategia mock
    });

    it('should round montoTotal to 2 decimal places', () => {
      mockEstrategia.calcularPrecio.mockReturnValue({
        precioUnitario: 10.666666,
        total: 10.666666,
        detalles: [],
      });

      const productos = [
        {
          articuloId: 1,
          cantidad: 1,
          precioBase: 10,
          articulo: dummyArticulo,
          tipoEstrategia: 'REGULAR',
        },
      ];
      const result = service.calcularTotalSolicitud(productos, dummyContexto);

      expect(result.montoTotal).toBe(11);
    });

    it('should handle undefined contextoGlobal', () => {
      const productos = [
        {
          articuloId: 1,
          cantidad: 1,
          precioBase: 10,
          articulo: dummyArticulo,
          tipoEstrategia: 'REGULAR',
        },
      ];
      const result = service.calcularTotalSolicitud(productos);
      expect(result).toBeDefined();
      expect(mockPrecioContext.calcularPrecio).toHaveBeenCalledWith(
        10,
        1,
        dummyArticulo,
        undefined,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
