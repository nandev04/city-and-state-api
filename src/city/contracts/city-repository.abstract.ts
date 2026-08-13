import { City, State } from '../../../generated/prisma/client';

export type CityWithState = City & { state: State };

export abstract class CityRepository {
  abstract save(name: string, stateId: number): Promise<CityWithState>;
  abstract findAll(params: {
    cursor?: number;
    limit: number;
    stateId?: number;
    name?: string;
  }): Promise<CityWithState[]>;
  abstract findByNameAndStateId(
    name: string,
    stateId: number,
  ): Promise<City | null>;
  abstract findById(id: number): Promise<CityWithState | null>;
  abstract update(
    id: number,
    data: { name?: string; stateId?: number },
  ): Promise<CityWithState>;
  abstract delete(id: number): Promise<void>;
}
