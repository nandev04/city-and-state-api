import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { StateRepository } from './contracts/state-repository.abstract';
import { PrismaStateRepository } from './repositories/state.repository';

@Module({
  controllers: [StateController],
  providers: [
    StateService,
    {
      provide: StateRepository,
      useClass: PrismaStateRepository,
    },
  ],
})
export class StateModule {}
