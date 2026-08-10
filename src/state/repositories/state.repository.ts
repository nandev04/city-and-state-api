import { Injectable } from '@nestjs/common';
import { State } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  StateRepository,
  StateWithCities,
} from '../contracts/state-repository.abstract';

@Injectable()
export class PrismaStateRepository implements StateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(name: string, stateCode: string): Promise<State> {
    return this.prisma.state.create({
      data: { name, stateCode },
    });
  }

  async list(): Promise<State[] | null> {
    return this.prisma.state.findMany({
      where: { deletedAt: null },
    });
  }

  async listById(id: number): Promise<StateWithCities | null> {
    return this.prisma.state.findFirst({
      where: { id, deletedAt: null },
      include: { cities: { where: { deletedAt: null } } },
    });
  }

  async listByStateCode(uf: string): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: { stateCode: uf, deletedAt: null },
    });
  }

  async listByName(name: string): Promise<State | null> {
    return this.prisma.state.findFirst({
      where: { name, deletedAt: null },
    });
  }

  async existsById(id: number): Promise<boolean> {
    const state = await this.prisma.state.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    return state !== null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.state.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
