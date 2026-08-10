import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StateRepository } from '../state/contracts/state-repository.abstract';
import { CityRepository } from './contracts/city-repository.abstract';
import { CreateCityDto } from './dto/create-city.dto';
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

  findAll() {
    return `This action returns all city`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
