import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FindAllCitiesResponseDto } from '../dto/city-response.dto';

export const ApiFindAllCities = () =>
  applyDecorators(
    ApiOperation({
      summary:
        'Lista cidades paginadas por cursor. Aceita filtros opcionais por UF e por nome (busca parcial, case-insensitive).',
    }),
    ApiOkResponse({
      description: 'Página de cidades.',
      type: FindAllCitiesResponseDto.Output,
    }),
    ApiBadRequestResponse({ description: 'Parâmetros de query inválidos.' }),
    ApiNotFoundResponse({
      description: 'UF informada no filtro não corresponde a nenhum estado.',
    }),
  );
