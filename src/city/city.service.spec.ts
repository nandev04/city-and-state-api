import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { State } from '../../generated/prisma/client';
import {
  StateRepository,
  StateWithCities,
} from '../state/contracts/state-repository.abstract';
import { CityService } from './city.service';
import {
  CityRepository,
  CityWithState,
} from './contracts/city-repository.abstract';

const now = new Date();

describe('CityService', () => {
  let service: CityService;
  let cityRepository: jest.Mocked<CityRepository>;
  let stateRepository: jest.Mocked<StateRepository>;

  beforeEach(async () => {
    const cityRepositoryMock: jest.Mocked<CityRepository> = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByNameAndStateId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const stateRepositoryMock: jest.Mocked<StateRepository> = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByStateCode: jest.fn(),
      findByName: jest.fn(),
      existsById: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        { provide: CityRepository, useValue: cityRepositoryMock },
        { provide: StateRepository, useValue: stateRepositoryMock },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get(CityRepository);
    stateRepository = module.get(StateRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const stateSP: StateWithCities = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      cities: [],
    };

    const createdCity: CityWithState = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      state: stateSP,
    };

    it('cria a cidade quando o estado existe e não há duplicata', async () => {
      stateRepository.findByStateCode.mockResolvedValue(stateSP);
      cityRepository.findByNameAndStateId.mockResolvedValue(null);
      cityRepository.save.mockResolvedValue(createdCity);

      await expect(
        service.create({ name: 'Campinas', stateCode: 'SP' }),
      ).resolves.toEqual(createdCity);

      expect(stateRepository.findByStateCode).toHaveBeenCalledWith('SP');
      expect(cityRepository.findByNameAndStateId).toHaveBeenCalledWith(
        'Campinas',
        1,
      );
      expect(cityRepository.save).toHaveBeenCalledWith('Campinas', 1);
    });

    it('lança NotFoundException quando o stateCode informado não existe', async () => {
      stateRepository.findByStateCode.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Campinas', stateCode: 'ZZ' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(cityRepository.findByNameAndStateId).not.toHaveBeenCalled();
      expect(cityRepository.save).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando já existe cidade com mesmo name no estado', async () => {
      stateRepository.findByStateCode.mockResolvedValue(stateSP);
      cityRepository.findByNameAndStateId.mockResolvedValue(createdCity);

      await expect(
        service.create({ name: 'Campinas', stateCode: 'SP' }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(cityRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const stateSP: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const makeCities = (count: number, startId = 1): CityWithState[] =>
      Array.from({ length: count }, (_, i) => ({
        id: startId + i,
        name: `Cidade ${startId + i}`,
        stateId: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        state: stateSP,
      }));

    it('retorna lista vazia com nextCursor null e hasNextPage false quando não há cidades', async () => {
      cityRepository.findAll.mockResolvedValue([]);

      await expect(
        service.findAll({ limit: 20, cursor: undefined, stateCode: undefined }),
      ).resolves.toEqual({ data: [], nextCursor: null, hasNextPage: false });
      expect(cityRepository.findAll).toHaveBeenCalledWith({
        cursor: undefined,
        limit: 21,
        stateId: undefined,
        name: undefined,
      });
    });

    it('retorna hasNextPage false quando resultado é menor que o limit', async () => {
      const cities = makeCities(5);
      cityRepository.findAll.mockResolvedValue(cities);

      await expect(
        service.findAll({ limit: 20, cursor: undefined, stateCode: undefined }),
      ).resolves.toEqual({
        data: cities,
        nextCursor: null,
        hasNextPage: false,
      });
    });

    it('retorna hasNextPage false quando resultado é exatamente do tamanho do limit', async () => {
      const cities = makeCities(20);
      cityRepository.findAll.mockResolvedValue(cities);

      const result = await service.findAll({
        limit: 20,
        cursor: undefined,
        stateCode: undefined,
      });

      expect(result.data).toHaveLength(20);
      expect(result.nextCursor).toBeNull();
      expect(result.hasNextPage).toBe(false);
    });

    it('retorna nextCursor com id do último item e hasNextPage true quando há próxima página', async () => {
      const cities = makeCities(21);
      cityRepository.findAll.mockResolvedValue(cities);

      const result = await service.findAll({
        limit: 20,
        cursor: undefined,
        stateCode: undefined,
      });

      expect(result.data).toHaveLength(20);
      expect(result.nextCursor).toBe(20);
      expect(result.hasNextPage).toBe(true);
    });

    it('resolve stateCode para stateId e encaminha para o repository', async () => {
      const state: StateWithCities = {
        id: 3,
        name: 'São Paulo',
        stateCode: 'SP',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        cities: [],
      };
      stateRepository.findByStateCode.mockResolvedValue(state);
      cityRepository.findAll.mockResolvedValue([]);

      await service.findAll({ cursor: 10, limit: 5, stateCode: 'SP' });

      expect(stateRepository.findByStateCode).toHaveBeenCalledWith('SP');
      expect(cityRepository.findAll).toHaveBeenCalledWith({
        cursor: 10,
        limit: 6,
        stateId: 3,
        name: undefined,
      });
    });

    it('encaminha o filtro de nome parcial para o repository', async () => {
      cityRepository.findAll.mockResolvedValue([]);

      await service.findAll({
        limit: 20,
        cursor: undefined,
        stateCode: undefined,
        name: 'camp',
      });

      expect(cityRepository.findAll).toHaveBeenCalledWith({
        cursor: undefined,
        limit: 21,
        stateId: undefined,
        name: 'camp',
      });
    });

    it('lança NotFoundException quando o stateCode informado não existe', async () => {
      stateRepository.findByStateCode.mockResolvedValue(null);

      await expect(
        service.findAll({ limit: 20, cursor: undefined, stateCode: 'ZZ' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(cityRepository.findAll).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    const stateSP: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const city: CityWithState = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      state: stateSP,
    };

    it('retorna a cidade quando encontrada', async () => {
      cityRepository.findById.mockResolvedValue(city);

      await expect(service.findById(10)).resolves.toEqual(city);
      expect(cityRepository.findById).toHaveBeenCalledWith(10);
    });

    it('lança NotFoundException quando a cidade não existe', async () => {
      cityRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const stateSP: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const existingCity: CityWithState = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      state: stateSP,
    };

    it('lança NotFoundException quando a cidade não existe', async () => {
      cityRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Nova' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(stateRepository.existsById).not.toHaveBeenCalled();
      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('atualiza apenas o name quando não há colisão no mesmo estado', async () => {
      const updated: CityWithState = { ...existingCity, name: 'Campinas Nova' };
      cityRepository.findById.mockResolvedValue(existingCity);
      cityRepository.findByNameAndStateId.mockResolvedValue(null);
      cityRepository.update.mockResolvedValue(updated);

      await expect(
        service.update(10, { name: 'Campinas Nova' }),
      ).resolves.toEqual(updated);

      expect(stateRepository.existsById).not.toHaveBeenCalled();
      expect(cityRepository.findByNameAndStateId).toHaveBeenCalledWith(
        'Campinas Nova',
        1,
      );
      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: 'Campinas Nova',
        stateId: undefined,
      });
    });

    it('quando o name enviado é o mesmo da cidade, findByNameAndStateId retorna a própria cidade e não lança 409', async () => {
      const updated: CityWithState = { ...existingCity };
      cityRepository.findById.mockResolvedValue(existingCity);
      cityRepository.findByNameAndStateId.mockResolvedValue(existingCity);
      cityRepository.update.mockResolvedValue(updated);

      await expect(service.update(10, { name: 'Campinas' })).resolves.toEqual(
        updated,
      );

      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: 'Campinas',
        stateId: undefined,
      });
    });

    it('lança ConflictException quando o novo name colide com outra cidade no mesmo estado', async () => {
      cityRepository.findById.mockResolvedValue(existingCity);
      cityRepository.findByNameAndStateId.mockResolvedValue({
        id: 55,
        name: 'Campinas Nova',
        stateId: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      await expect(
        service.update(10, { name: 'Campinas Nova' }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('não lança 409 quando findByNameAndStateId retorna a própria cidade', async () => {
      const updated: CityWithState = { ...existingCity, name: 'Campinas Nova' };
      cityRepository.findById.mockResolvedValue(existingCity);
      cityRepository.findByNameAndStateId.mockResolvedValue(existingCity);
      cityRepository.update.mockResolvedValue(updated);

      await expect(
        service.update(10, { name: 'Campinas Nova' }),
      ).resolves.toEqual(updated);
    });

    it('valida existência do novo stateId e lança NotFoundException quando ele não existe', async () => {
      cityRepository.findById.mockResolvedValue(existingCity);
      stateRepository.existsById.mockResolvedValue(false);

      await expect(service.update(10, { stateId: 999 })).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(stateRepository.existsById).toHaveBeenCalledWith(999);
      expect(cityRepository.findByNameAndStateId).not.toHaveBeenCalled();
      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('quando o stateId enviado é o mesmo do atual, ainda valida existência e não lança 409 ao encontrar a própria cidade', async () => {
      const updated: CityWithState = { ...existingCity };
      cityRepository.findById.mockResolvedValue(existingCity);
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue(existingCity);
      cityRepository.update.mockResolvedValue(updated);

      await expect(service.update(10, { stateId: 1 })).resolves.toEqual(
        updated,
      );

      expect(stateRepository.existsById).toHaveBeenCalledWith(1);
      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: undefined,
        stateId: 1,
      });
    });

    it('ao mover para outro estado, verifica colisão com (name atual, novo stateId)', async () => {
      const updated: CityWithState = { ...existingCity, stateId: 2 };
      cityRepository.findById.mockResolvedValue(existingCity);
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue(null);
      cityRepository.update.mockResolvedValue(updated);

      await expect(service.update(10, { stateId: 2 })).resolves.toEqual(
        updated,
      );

      expect(cityRepository.findByNameAndStateId).toHaveBeenCalledWith(
        'Campinas',
        2,
      );
      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: undefined,
        stateId: 2,
      });
    });

    it('lança ConflictException ao mover para estado onde já existe cidade com o mesmo name', async () => {
      cityRepository.findById.mockResolvedValue(existingCity);
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue({
        id: 77,
        name: 'Campinas',
        stateId: 2,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      await expect(service.update(10, { stateId: 2 })).rejects.toBeInstanceOf(
        ConflictException,
      );

      expect(cityRepository.update).not.toHaveBeenCalled();
    });

    it('atualiza name e stateId juntos quando tudo é válido', async () => {
      const updated: CityWithState = {
        id: 10,
        name: 'Nova',
        stateId: 2,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        state: stateSP,
      };
      cityRepository.findById.mockResolvedValue(existingCity);
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue(null);
      cityRepository.update.mockResolvedValue(updated);

      await expect(
        service.update(10, { name: 'Nova', stateId: 2 }),
      ).resolves.toEqual(updated);

      expect(stateRepository.existsById).toHaveBeenCalledWith(2);
      expect(cityRepository.findByNameAndStateId).toHaveBeenCalledWith(
        'Nova',
        2,
      );
      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: 'Nova',
        stateId: 2,
      });
    });

    it('com body vazio, não valida nada e chama update direto', async () => {
      const updated: CityWithState = { ...existingCity };
      cityRepository.findById.mockResolvedValue(existingCity);
      cityRepository.update.mockResolvedValue(updated);

      await expect(service.update(10, {})).resolves.toEqual(updated);

      expect(stateRepository.existsById).not.toHaveBeenCalled();
      expect(cityRepository.findByNameAndStateId).not.toHaveBeenCalled();
      expect(cityRepository.update).toHaveBeenCalledWith(10, {
        name: undefined,
        stateId: undefined,
      });
    });
  });

  describe('remove', () => {
    const stateSP: State = {
      id: 1,
      name: 'São Paulo',
      stateCode: 'SP',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    const city: CityWithState = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      state: stateSP,
    };

    it('faz soft delete quando a cidade existe', async () => {
      cityRepository.findById.mockResolvedValue(city);

      await expect(service.remove(city.id)).resolves.toBeUndefined();
      expect(cityRepository.findById).toHaveBeenCalledWith(10);
      expect(cityRepository.delete).toHaveBeenCalledWith(10);
    });

    it('retorna sem erro (idempotente) quando a cidade não existe', async () => {
      cityRepository.findById.mockResolvedValue(null);

      await expect(service.remove(999)).resolves.toBeUndefined();
      expect(cityRepository.delete).not.toHaveBeenCalled();
    });
  });
});
