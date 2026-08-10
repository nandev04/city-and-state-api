import { Injectable } from '@nestjs/common';
import { City } from '../../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CityRepository } from '../contracts/city-repository.abstract';

@Injectable()
export class PrismaCityRepository implements CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(name: string, stateId: number): Promise<City> {
    return this.prisma.city.create({
      data: { name, stateId },
    });
  }

  async list(params: {
    cursor?: number;
    limit: number;
    stateId?: number;
  }): Promise<City[]> {
    const { cursor, limit, stateId } = params;

    return this.prisma.city.findMany({
      where: {
        deletedAt: null,
        ...(stateId !== undefined && { stateId }),
        ...(cursor !== undefined && { id: { gt: cursor } }),
      },
      orderBy: { id: 'asc' },
      take: limit,
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

  async findById(id: number): Promise<City | null> {
    return this.prisma.city.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.city.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
