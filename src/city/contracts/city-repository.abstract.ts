import { City } from '../../../generated/prisma/client';

export abstract class CityRepository {
  abstract save(name: string, stateId: number): Promise<City>;
  abstract list(params: {
    cursor?: number;
    limit: number;
    stateId?: number;
  }): Promise<City[]>;
  abstract findByNameAndStateId(
    name: string,
    stateId: number,
  ): Promise<City | null>;
  abstract findById(id: number): Promise<City | null>;
  abstract update(
    id: number,
    data: { name?: string; stateId?: number },
  ): Promise<City>;
  abstract delete(id: number): Promise<void>;
}
