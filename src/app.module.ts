import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CityModule, StateModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
