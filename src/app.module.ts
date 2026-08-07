import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CityModule, StateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
