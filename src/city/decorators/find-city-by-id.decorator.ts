import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CityResponseDto } from '../dto/city-response.dto';

export const ApiFindCityById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Busca uma cidade pelo id.' }),
    ApiOkResponse({
      description: 'Cidade encontrada.',
      type: CityResponseDto.Output,
    }),
    ApiBadRequestResponse({ description: 'Id inválido.' }),
    ApiNotFoundResponse({ description: 'Cidade não encontrada.' }),
  );
