import { Module } from '@nestjs/common';
import { ProductosService } from 'src/aplicacion/services/productos.service';
import { ProductosRepository } from 'src/infraestructura/adapters/productos.repository';
import { DataBaseModule } from 'src/infraestructura/database/database.module';
import { ProductosController } from 'src/presentacion/controllers/productos.controller';

@Module({
  imports: [DataBaseModule],
  controllers: [ProductosController],
  providers: [
    ProductosService,
    { provide: 'ProductosRepositoryPort', useClass: ProductosRepository },
  ],
  exports: [],
})
export class ProductosModule {}
