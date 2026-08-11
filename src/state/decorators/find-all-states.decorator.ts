import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { FindAllStatesResponseDto } from '../dto/state-response.dto';

export const ApiFindAllStates = () =>
  applyDecorators(
    ApiOperation({ summary: 'Lista estados paginados por cursor.' }),
    ApiOkResponse({
      description: 'Página de estados.',
      type: FindAllStatesResponseDto,
    }),
    ApiBadRequestResponse({ description: 'Parâmetros de query inválidos.' }),
  );
