import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
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

  findAll() {
    return `This action returns all state`;
  }

  findOne(id: number) {
    return `This action returns a #${id} state`;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }
}
