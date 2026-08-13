import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CityResponseDto } from '../dto/city-response.dto';

export const ApiUpdateCity = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualiza uma cidade existente.' }),
    ApiOkResponse({
      description: 'Cidade atualizada.',
      type: CityResponseDto.Output,
    }),
    ApiBadRequestResponse({ description: 'Payload ou id inválidos.' }),
    ApiNotFoundResponse({
      description: 'Cidade ou estado informado não encontrado.',
    }),
    ApiConflictResponse({
      description:
        'Já existe outra cidade com o mesmo nome no estado informado.',
    }),
  );
