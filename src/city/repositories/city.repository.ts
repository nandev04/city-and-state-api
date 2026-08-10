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

  async findByNameAndStateId(
    name: string,
    stateId: number,
  ): Promise<City | null> {
    return this.prisma.city.findFirst({
      where: { name, stateId, deletedAt: null },
    });
  }
}
