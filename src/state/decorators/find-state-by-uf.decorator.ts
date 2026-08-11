import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { StateResponseDto } from '../dto/state-response.dto';

export const ApiFindStateByUf = () =>
  applyDecorators(
    ApiOperation({ summary: 'Busca um estado pela UF.' }),
    ApiParam({
      name: 'uf',
      description: 'UF do estado (2 letras maiúsculas).',
      example: 'SP',
    }),
    ApiOkResponse({
      description: 'Estado encontrado.',
      type: StateResponseDto,
    }),
    ApiNotFoundResponse({ description: 'Estado não encontrado.' }),
  );
