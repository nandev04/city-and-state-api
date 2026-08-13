import { Injectable } from '@nestjs/common';
import { State } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  StateRepository,
  StateWithCities,
} from '../contracts/state-repository.abstract';

const includeCities = {
  cities: { where: { deletedAt: null } },
} as const;

@Injectable()
export class PrismaStateRepository implements StateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(name: string, stateCode: string): Promise<StateWithCities> {
    return this.prisma.state.create({
      data: { name, stateCode },
      include: includeCities,
    });
  }

  async findAll(params: {
    cursor?: number;
    limit: number;
  }): Promise<StateWithCities[]> {
    const { cursor, limit } = params;

    return this.prisma.state.findMany({
      where: {
        deletedAt: null,
        ...(cursor !== undefined && { id: { gt: cursor } }),
      },
      orderBy: { id: 'asc' },
      take: limit,
      include: includeCities,
    });
  }

  async findById(id: number): Promise<StateWithCities | null> {
    return this.prisma.state.findFirst({
      where: { id, deletedAt: null },
      include: includeCities,
    });
  }

  async findByStateCode(uf: string): Promise<StateWithCities | null> {
    return this.prisma.state.findFirst({
      where: { stateCode: uf, deletedAt: null },
      include: includeCities,
    });
  }

  async findByName(name: string): Promise<State | null> {
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

  async update(
    id: number,
    data: { name?: string; stateCode?: string },
  ): Promise<StateWithCities> {
    return this.prisma.state.update({
      where: { id },
      data,
      include: includeCities,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.state.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
