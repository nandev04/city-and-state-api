import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const ApiRemoveState = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove um estado (soft delete). Operação idempotente.',
    }),
    ApiNoContentResponse({
      description:
        'Estado removido. Retornado também quando o estado não existe (idempotência).',
    }),
    ApiBadRequestResponse({ description: 'Id inválido.' }),
    ApiConflictResponse({
      description:
        'O estado possui cidades vinculadas e não pode ser removido.',
    }),
  );
