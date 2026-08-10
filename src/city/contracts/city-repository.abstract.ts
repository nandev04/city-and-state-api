import { City } from '../../../generated/prisma/client';

export abstract class CityRepository {
  abstract save(name: string, stateId: number): Promise<City>;
  abstract findByNameAndStateId(
    name: string,
    stateId: number,
  ): Promise<City | null>;
}
