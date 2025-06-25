import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BearerAuthToken,
  VersionDescription,
} from '../decorators/controller.decorator';
import { ProductosService } from 'src/aplicacion/services/productos.service';

@ApiTags('[Productos] Productos'.toUpperCase())
@Controller('productos')
export class ProductosController {
  constructor(private readonly ProductosService: ProductosService) {}

  @Post('registrar')
  @BearerAuthToken()
  @VersionDescription('1', 'Servico para crear de un productos')
  async register(@Body() registerDto: any) {
    return await this.ProductosService.createPrductos({
      articuloId: registerDto.articuloId,
      parametrosEspecificos: registerDto.parametrosEspecificos,
      cantidad: registerDto.cantidad,
      precioUnitario: registerDto.precioUnitario,
      cantidadMinima: registerDto.cantidadMinima,
      esVisibleMp: registerDto.esVisibleMp,
      fechaIngreso: registerDto.fechaIngreso,
    });
  }
}
