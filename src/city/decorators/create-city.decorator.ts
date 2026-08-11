import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CityResponseDto } from '../dto/city-response.dto';

export const ApiCreateCity = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria uma nova cidade.' }),
    ApiCreatedResponse({
      description: 'Cidade criada.',
      type: CityResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Payload inválido.' }),
    ApiNotFoundResponse({ description: 'Estado informado não encontrado.' }),
    ApiConflictResponse({
      description: 'Já existe uma cidade com o mesmo nome neste estado.',
    }),
  );
