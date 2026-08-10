import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { StateRepository } from './contracts/state-repository.abstract';
import { PrismaStateRepository } from './repositories/state.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StateController],
  providers: [
    StateService,
    {
      provide: StateRepository,
      useClass: PrismaStateRepository,
    },
  ],
  exports: [StateRepository],
})
export class StateModule {}
