import { Injectable } from '@nestjs/common';
import { City } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CityRepository,
  CityWithState,
} from '../contracts/city-repository.abstract';

const includeState = { state: true } as const;

@Injectable()
export class PrismaCityRepository implements CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(name: string, stateId: number): Promise<CityWithState> {
    return this.prisma.city.create({
      data: { name, stateId },
      include: includeState,
    });
  }

  async findAll(params: {
    cursor?: number;
    limit: number;
    stateId?: number;
    name?: string;
  }): Promise<CityWithState[]> {
    const { cursor, limit, stateId, name } = params;

    return this.prisma.city.findMany({
      where: {
        deletedAt: null,
        ...(stateId && { stateId }),
        ...(cursor && { id: { gt: cursor } }),
        ...(name && {
          name: { contains: name, mode: 'insensitive' },
        }),
      },
      orderBy: { id: 'asc' },
      take: limit,
      include: includeState,
    });
  }

  async findByNameAndStateId(
    name: string,
    stateId: number,
  ): Promise<City | null> {
    return this.prisma.city.findFirst({
      where: { name, stateId, deletedAt: null },
    });
  }

  async findById(id: number): Promise<CityWithState | null> {
    return this.prisma.city.findFirst({
      where: { id, deletedAt: null },
      include: includeState,
    });
  }

  async update(
    id: number,
    data: { name?: string; stateId?: number },
  ): Promise<CityWithState> {
    return this.prisma.city.update({
      where: { id },
      data,
      include: includeState,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.city.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
