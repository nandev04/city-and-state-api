import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StateRepository } from '../state/contracts/state-repository.abstract';
import { CityRepository } from './contracts/city-repository.abstract';
import { CreateCityDto } from './dto/create-city.dto';
import { FindAllCitiesQueryDto } from './dto/find-all-cities-query.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CityService {
  constructor(
    private readonly cityRepository: CityRepository,
    private readonly stateRepository: StateRepository,
  ) {}

  async create(createCityDto: CreateCityDto) {
    const { name, stateId } = createCityDto;

    const stateExists = await this.stateRepository.existsById(stateId);

    if (!stateExists)
      throw new NotFoundException(`Estado com id "${stateId}" não encontrado.`);

    const existing = await this.cityRepository.findByNameAndStateId(
      name,
      stateId,
    );

    if (existing)
      throw new ConflictException(
        `Já existe uma cidade com o nome "${name}" no estado "${stateId}".`,
      );

    return this.cityRepository.save(name, stateId);
  }

  async findAll(query: FindAllCitiesQueryDto) {
    const { cursor, limit, stateCode } = query;

    let stateId: number | undefined;
    if (stateCode) {
      const state = await this.stateRepository.listByStateCode(stateCode);

      if (!state)
        throw new NotFoundException(
          `Estado com UF "${stateCode}" não encontrado.`,
        );

      stateId = state.id;
    }

    const rows = await this.cityRepository.list({
      cursor,
      limit: limit + 1,
      stateId,
    });

    const hasNextPage = rows.length > limit;
    const data = hasNextPage ? rows.slice(0, limit) : rows;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return { data, nextCursor, hasNextPage };
  }

  async findById(id: number) {
    const city = await this.cityRepository.findById(id);

    if (!city)
      throw new NotFoundException(`Cidade com id "${id}" não encontrada.`);

    return city;
  }

  async update(id: number, updateCityDto: UpdateCityDto) {
    const city = await this.cityRepository.findById(id);

    if (!city)
      throw new NotFoundException(`Cidade com id "${id}" não encontrada.`);

    const { name, stateId } = updateCityDto;

    if (stateId) {
      const stateExists = await this.stateRepository.existsById(stateId);

      if (!stateExists)
        throw new NotFoundException(
          `Estado com id "${stateId}" não encontrado.`,
        );
    }

    if (name || stateId) {
      const targetName = name ?? city.name;
      const targetStateId = stateId ?? city.stateId;

      const existing = await this.cityRepository.findByNameAndStateId(
        targetName,
        targetStateId,
      );

      if (existing && existing.id !== id)
        throw new ConflictException(
          `Já existe uma cidade com o nome "${targetName}" no estado "${targetStateId}".`,
        );
    }

    return this.cityRepository.update(id, { name, stateId });
  }

  async remove(id: number): Promise<void> {
    const city = await this.cityRepository.findById(id);

    if (!city) return;

    await this.cityRepository.delete(id);
  }
}
