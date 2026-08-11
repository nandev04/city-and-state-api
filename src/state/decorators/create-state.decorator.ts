import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { StateResponseDto } from '../dto/state-response.dto';

export const ApiCreateState = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo estado.' }),
    ApiCreatedResponse({
      description: 'Estado criado.',
      type: StateResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Payload inválido.' }),
    ApiConflictResponse({
      description: 'Já existe um estado com a mesma UF ou nome.',
    }),
  );
