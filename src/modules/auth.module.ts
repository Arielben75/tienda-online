import { Global, Module } from '@nestjs/common';

import { AuthService } from '../aplicacion/services/auth.service';
import { AuthController } from 'src/presentacion/controllers/auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
