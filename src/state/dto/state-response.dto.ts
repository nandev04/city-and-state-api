import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const stateResponseSchema = z.object({
  id: z.number().int().positive().meta({ example: 1 }),
  name: z.string().meta({ example: 'São Paulo' }),
  stateCode: z.string().length(2).meta({ example: 'SP' }),
  cities: z.array(
    z.object({
      id: z.number().int().positive().meta({ example: 10 }),
      name: z.string().meta({ example: 'Campinas' }),
    }),
  ),
});

export class StateResponseDto extends createZodDto(stateResponseSchema) {}

const findAllStatesResponseSchema = z.object({
  data: z.array(stateResponseSchema),
  nextCursor: z.number().int().positive().nullable().meta({
    description: 'Cursor para a próxima página. `null` na última página.',
    example: 20,
  }),
  hasNextPage: z.boolean().meta({ example: true }),
});

export class FindAllStatesResponseDto extends createZodDto(
  findAllStatesResponseSchema,
) {}
