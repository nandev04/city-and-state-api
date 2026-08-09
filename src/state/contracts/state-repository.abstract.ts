import { State } from '../../../generated/prisma/client';

export abstract class StateRepository {
  abstract save(name: string, stateCode: string): Promise<State>;
  abstract list(): Promise<State[] | null>;
  abstract listByStateCode(uf: string): Promise<State | null>;
  abstract listByName(name: string): Promise<State | null>;
  abstract delete(id: number): Promise<void>;
}
