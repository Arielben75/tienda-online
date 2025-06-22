import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth.module';

const modules = [AuthModule];

@Module({
  imports: [
    ...modules,
    RouterModule.register(
      modules.map((module) => ({
        path: 'api', // Path to modules
        module,
      })),
    ),
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
