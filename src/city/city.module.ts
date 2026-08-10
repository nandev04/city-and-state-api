import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { StateModule } from '../state/state.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { CityRepository } from './contracts/city-repository.abstract';
import { PrismaCityRepository } from './repositories/city.repository';

@Module({
  imports: [PrismaModule, StateModule],
  controllers: [CityController],
  providers: [
    CityService,
    {
      provide: CityRepository,
      useClass: PrismaCityRepository,
    },
  ],
})
export class CityModule {}
