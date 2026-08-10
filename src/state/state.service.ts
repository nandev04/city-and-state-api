import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { FindAllStatesQueryDto } from './dto/find-all-states-query.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateRepository } from './contracts/state-repository.abstract';

@Injectable()
export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  async create(createStateDto: CreateStateDto) {
    const { name, stateCode } = createStateDto;

    const [existingByCode, existingByName] = await Promise.all([
      this.stateRepository.listByStateCode(stateCode),
      this.stateRepository.listByName(name),
    ]);

    if (existingByCode)
      throw new ConflictException(
        `Já existe um estado com a UF "${stateCode}".`,
      );

    if (existingByName)
      throw new ConflictException(`Já existe um estado com o nome "${name}".`);

    return this.stateRepository.save(name, stateCode);
  }

  async findAll(query: FindAllStatesQueryDto) {
    const { cursor, limit } = query;

    const rows = await this.stateRepository.list({
      cursor,
      limit: limit + 1,
    });

    const hasNextPage = rows.length > limit;
    const data = hasNextPage ? rows.slice(0, limit) : rows;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return { data, nextCursor, hasNextPage };
  }

  async findOne(uf: string) {
    const state = await this.stateRepository.listByStateCode(uf);

    if (!state)
      throw new NotFoundException(`Estado com UF "${uf}" não encontrado.`);

    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const state = await this.stateRepository.listById(id);

    if (!state)
      throw new NotFoundException(`Estado com id "${id}" não encontrado.`);

    const { name, stateCode } = updateStateDto;

    if (stateCode && stateCode !== state.stateCode) {
      const existingByCode =
        await this.stateRepository.listByStateCode(stateCode);

      if (existingByCode && existingByCode.id !== id)
        throw new ConflictException(
          `Já existe um estado com a UF "${stateCode}".`,
        );
    }

    if (name && name !== state.name) {
      const existingByName = await this.stateRepository.listByName(name);

      if (existingByName && existingByName.id !== id)
        throw new ConflictException(
          `Já existe um estado com o nome "${name}".`,
        );
    }

    return this.stateRepository.update(id, { name, stateCode });
  }

  async remove(id: number): Promise<void> {
    const state = await this.stateRepository.listById(id);

    if (!state) return;

    if (state.cities.length > 0)
      throw new ConflictException(
        `Não é possível excluir o estado "${state.stateCode}" pois existem cidades vinculadas.`,
      );

    await this.stateRepository.delete(id);
  }
}
