import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [CityModule, StateModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
