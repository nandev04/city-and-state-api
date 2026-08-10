import { City, State } from '../../../generated/prisma/client';

export type StateWithCities = State & { cities: City[] };

export abstract class StateRepository {
  abstract save(name: string, stateCode: string): Promise<State>;
  abstract list(): Promise<State[] | null>;
  abstract listById(id: number): Promise<StateWithCities | null>;
  abstract listByStateCode(uf: string): Promise<State | null>;
  abstract listByName(name: string): Promise<State | null>;
  abstract existsById(id: number): Promise<boolean>;
  abstract update(
    id: number,
    data: { name?: string; stateCode?: string },
  ): Promise<State>;
  abstract delete(id: number): Promise<void>;
}
