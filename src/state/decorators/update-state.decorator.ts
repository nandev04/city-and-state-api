import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { StateResponseDto } from '../dto/state-response.dto';

export const ApiUpdateState = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualiza um estado existente.' }),
    ApiOkResponse({
      description: 'Estado atualizado.',
      type: StateResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Payload ou id inválidos.' }),
    ApiNotFoundResponse({ description: 'Estado não encontrado.' }),
    ApiConflictResponse({
      description: 'Já existe outro estado com a mesma UF ou nome.',
    }),
  );
