import { City, State } from '../../../generated/prisma/client';

export type StateWithCities = State & { cities: City[] };

export abstract class StateRepository {
  abstract save(name: string, stateCode: string): Promise<State>;
  abstract findAll(params: {
    cursor?: number;
    limit: number;
  }): Promise<State[]>;
  abstract findById(id: number): Promise<StateWithCities | null>;
  abstract findByStateCode(uf: string): Promise<State | null>;
  abstract findByName(name: string): Promise<State | null>;
  abstract existsById(id: number): Promise<boolean>;
  abstract update(
    id: number,
    data: { name?: string; stateCode?: string },
  ): Promise<State>;
  abstract delete(id: number): Promise<void>;
}
