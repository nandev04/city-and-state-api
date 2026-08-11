import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';

export const ApiRemoveCity = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Remove uma cidade (soft delete). Operação idempotente.',
    }),
    ApiNoContentResponse({
      description:
        'Cidade removida. Retornado também quando a cidade não existe (idempotência).',
    }),
    ApiBadRequestResponse({ description: 'Id inválido.' }),
  );
