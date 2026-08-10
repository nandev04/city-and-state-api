import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { City } from '../../generated/prisma/client';
import { StateRepository } from '../state/contracts/state-repository.abstract';
import { CityService } from './city.service';
import { CityRepository } from './contracts/city-repository.abstract';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: jest.Mocked<CityRepository>;
  let stateRepository: jest.Mocked<StateRepository>;

  beforeEach(async () => {
    const cityRepositoryMock: jest.Mocked<CityRepository> = {
      save: jest.fn(),
      findByNameAndStateId: jest.fn(),
    };

    const stateRepositoryMock: jest.Mocked<StateRepository> = {
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
    const createdCity: City = {
      id: 10,
      name: 'Campinas',
      stateId: 1,
      deletedAt: null,
    };

    it('cria a cidade quando o estado existe e não há duplicata', async () => {
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue(null);
      cityRepository.save.mockResolvedValue(createdCity);

      await expect(
        service.create({ name: 'Campinas', stateId: 1 }),
      ).resolves.toEqual(createdCity);

      expect(stateRepository.existsById).toHaveBeenCalledWith(1);
      expect(cityRepository.findByNameAndStateId).toHaveBeenCalledWith(
        'Campinas',
        1,
      );
      expect(cityRepository.save).toHaveBeenCalledWith('Campinas', 1);
    });

    it('lança NotFoundException quando o estado não existe', async () => {
      stateRepository.existsById.mockResolvedValue(false);

      await expect(
        service.create({ name: 'Campinas', stateId: 999 }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(cityRepository.findByNameAndStateId).not.toHaveBeenCalled();
      expect(cityRepository.save).not.toHaveBeenCalled();
    });

    it('lança ConflictException quando já existe cidade com mesmo name no estado', async () => {
      stateRepository.existsById.mockResolvedValue(true);
      cityRepository.findByNameAndStateId.mockResolvedValue(createdCity);

      await expect(
        service.create({ name: 'Campinas', stateId: 1 }),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(cityRepository.save).not.toHaveBeenCalled();
    });
  });
});
