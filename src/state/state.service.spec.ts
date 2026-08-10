import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { City, State } from '../../generated/prisma/client';
import {
  StateRepository,
  StateWithCities,
} from './contracts/state-repository.abstract';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;
  let repository: jest.Mocked<StateRepository>;

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<StateRepository> = {
      save: jest.fn(),
      list: jest.fn(),
      listById: jest.fn(),
      listByStateCode: jest.fn(),
      listByName: jest.fn(),
      existsById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        { provide: StateRepository, useValue: repositoryMock },
      ],
    }).compile();

    service = module.get<StateService>(StateService);
    repository = module.get(StateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('retorna o estado quando encontrado pela UF', async () => {
      const state: State = {
        id: 1,
        name: 'São Paulo',
        stateCode: 'SP',
        deletedAt: null,
      };
      repository.listByStateCode.mockResolvedValue(state);

      await expect(service.findOne('SP')).resolves.toEqual(state);
      expect(repository.listByStateCode).toHaveBeenCalledWith('SP');
    });

    it('lança NotFoundException quando a UF não existe', async () => {
      repository.listByStateCode.mockResolvedValue(null);

      await expect(service.findOne('ZZ')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const baseState: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      deletedAt: null,
    };
    const stateWithoutCities: StateWithCities = { ...baseState, cities: [] };
    const linkedCity: City = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      deletedAt: null,
    };
    const stateWithCities: StateWithCities = {
      ...baseState,
      cities: [linkedCity],
    };

    it('faz soft delete quando o estado existe e não possui cidades vinculadas', async () => {
      repository.listById.mockResolvedValue(stateWithoutCities);

      await expect(service.remove(baseState.id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('retorna sem erro (idempotente) quando o estado não existe', async () => {
      repository.listById.mockResolvedValue(null);

      await expect(service.remove(999)).resolves.toBeUndefined();
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando o estado possui cidades vinculadas', async () => {
      repository.listById.mockResolvedValue(stateWithCities);

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
