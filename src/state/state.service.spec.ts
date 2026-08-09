import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { State } from '../../generated/prisma/client';
import { StateRepository } from './contracts/state-repository.abstract';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;
  let repository: jest.Mocked<StateRepository>;

  beforeEach(async () => {
    const repositoryMock: jest.Mocked<StateRepository> = {
      save: jest.fn(),
      list: jest.fn(),
      listByStateCode: jest.fn(),
      listByName: jest.fn(),
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
});
