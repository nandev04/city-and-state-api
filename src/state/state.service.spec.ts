import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { City, State } from '../../generated/prisma/client';
import {
  StateRepository,
  StateWithCities,
} from './contracts/state-repository.abstract';
import { StateService } from './state.service';

const now = new Date();

describe('StateService', () => {
  let service: StateService;
  let repository: jest.Mocked<StateRepository>;

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<StateRepository> = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStateCode: jest.fn(),
      findByName: jest.fn(),
      existsById: jest.fn(),
      update: jest.fn(),
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

  describe('findByUf', () => {
    it('retorna o estado quando encontrado pela UF', async () => {
      const state: State = {
        id: 1,
        name: 'São Paulo',
        stateCode: 'SP',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      };
      repository.findByStateCode.mockResolvedValue(state);

      await expect(service.findByUf('SP')).resolves.toEqual(state);
      expect(repository.findByStateCode).toHaveBeenCalledWith('SP');
    });

    it('lança NotFoundException quando a UF não existe', async () => {
      repository.findByStateCode.mockResolvedValue(null);

      await expect(service.findByUf('ZZ')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const baseState: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    const stateWithoutCities: StateWithCities = { ...baseState, cities: [] };

    it('atualiza name e stateCode quando o estado existe e não há conflitos', async () => {
      repository.findById.mockResolvedValue(stateWithoutCities);
      repository.findByStateCode.mockResolvedValue(null);
      repository.findByName.mockResolvedValue(null);
      const updated: State = { ...baseState, name: 'Sampa', stateCode: 'SA' };
      repository.update.mockResolvedValue(updated);

      await expect(
        service.update(1, { name: 'Sampa', stateCode: 'SA' }),
      ).resolves.toEqual(updated);
      expect(repository.update).toHaveBeenCalledWith(1, {
        name: 'Sampa',
        stateCode: 'SA',
      });
    });

    it('lança NotFoundException quando o estado não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Qualquer' }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando outro estado já usa a UF', async () => {
      repository.findById.mockResolvedValue(stateWithoutCities);
      repository.findByStateCode.mockResolvedValue({
        ...baseState,
        id: 2,
        stateCode: 'RJ',
      });

      await expect(
        service.update(1, { stateCode: 'RJ' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando outro estado já usa o nome', async () => {
      repository.findById.mockResolvedValue(stateWithoutCities);
      repository.findByName.mockResolvedValue({
        ...baseState,
        id: 2,
        name: 'Rio de Janeiro',
      });

      await expect(
        service.update(1, { name: 'Rio de Janeiro' }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('não checa unicidade quando o valor recebido é igual ao atual', async () => {
      repository.findById.mockResolvedValue(stateWithoutCities);
      const updated: State = { ...baseState, name: 'São Paulo' };
      repository.update.mockResolvedValue(updated);

      await expect(
        service.update(1, { name: 'São Paulo', stateCode: 'SP' }),
      ).resolves.toEqual(updated);
      expect(repository.findByStateCode).not.toHaveBeenCalled();
      expect(repository.findByName).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const makeStates = (count: number, startId = 1): State[] =>
      Array.from({ length: count }, (_, i) => ({
        id: startId + i,
        name: `Estado ${startId + i}`,
        stateCode: 'AA',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      }));

    it('retorna lista vazia com nextCursor null e hasNextPage false quando não há estados', async () => {
      repository.findAll.mockResolvedValue([]);

      await expect(
        service.findAll({ limit: 20, cursor: undefined }),
      ).resolves.toEqual({ data: [], nextCursor: null, hasNextPage: false });
      expect(repository.findAll).toHaveBeenCalledWith({
        cursor: undefined,
        limit: 21,
      });
    });

    it('retorna hasNextPage false quando resultado é menor que o limit', async () => {
      const states = makeStates(5);
      repository.findAll.mockResolvedValue(states);

      await expect(
        service.findAll({ limit: 20, cursor: undefined }),
      ).resolves.toEqual({
        data: states,
        nextCursor: null,
        hasNextPage: false,
      });
    });

    it('retorna hasNextPage false quando resultado é exatamente do tamanho do limit', async () => {
      const states = makeStates(20);
      repository.findAll.mockResolvedValue(states);

      const result = await service.findAll({ limit: 20, cursor: undefined });

      expect(result.data).toHaveLength(20);
      expect(result.nextCursor).toBeNull();
      expect(result.hasNextPage).toBe(false);
    });

    it('retorna nextCursor com id do último item e hasNextPage true quando há próxima página', async () => {
      const states = makeStates(21);
      repository.findAll.mockResolvedValue(states);

      const result = await service.findAll({ limit: 20, cursor: undefined });

      expect(result.data).toHaveLength(20);
      expect(result.nextCursor).toBe(20);
      expect(result.hasNextPage).toBe(true);
    });

    it('encaminha cursor recebido e soma 1 no limit ao chamar o repository', async () => {
      repository.findAll.mockResolvedValue([]);

      await service.findAll({ cursor: 10, limit: 5 });

      expect(repository.findAll).toHaveBeenCalledWith({ cursor: 10, limit: 6 });
    });
  });

  describe('remove', () => {
    const baseState: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    const stateWithoutCities: StateWithCities = { ...baseState, cities: [] };
    const linkedCity: City = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    const stateWithCities: StateWithCities = {
      ...baseState,
      cities: [linkedCity],
    };

    it('faz soft delete quando o estado existe e não possui cidades vinculadas', async () => {
      repository.findById.mockResolvedValue(stateWithoutCities);

      await expect(service.remove(baseState.id)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('retorna sem erro (idempotente) quando o estado não existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).resolves.toBeUndefined();
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando o estado possui cidades vinculadas', async () => {
      repository.findById.mockResolvedValue(stateWithCities);

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
