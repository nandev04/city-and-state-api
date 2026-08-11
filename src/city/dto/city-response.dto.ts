import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const cityResponseSchema = z.object({
  id: z.number().int().positive().meta({ example: 1 }),
  name: z.string().meta({ example: 'Campinas' }),
  stateId: z.number().int().positive().meta({ example: 1 }),
  createdAt: z.iso.datetime().meta({ example: '2026-01-15T12:00:00.000Z' }),
  updatedAt: z.iso.datetime().meta({ example: '2026-01-15T12:00:00.000Z' }),
  deletedAt: z.iso
    .datetime()
    .nullable()
    .meta({ example: null, description: 'Data de exclusão lógica.' }),
});

export class CityResponseDto extends createZodDto(cityResponseSchema) {}

const findAllCitiesResponseSchema = z.object({
  data: z.array(cityResponseSchema),
  nextCursor: z.number().int().positive().nullable().meta({
    description: 'Cursor para a próxima página. `null` na última página.',
    example: 20,
  }),
  hasNextPage: z.boolean().meta({ example: true }),
});

export class FindAllCitiesResponseDto extends createZodDto(
  findAllCitiesResponseSchema,
) {}
