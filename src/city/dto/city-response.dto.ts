import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const cityResponseSchema = z
  .object({
    id: z.number().int().positive().meta({ example: 1 }),
    name: z.string().meta({ example: 'Campinas' }),
    state: z.object({
      name: z.string(),
      stateCode: z.string().length(2),
    }),
  })
  .transform((v) => ({
    id: v.id,
    name: v.name,
    state: v.state.name,
    stateCode: v.state.stateCode,
  }))
  .pipe(
    z.object({
      id: z.number().int().positive().meta({ example: 1 }),
      name: z.string().meta({ example: 'Campinas' }),
      state: z.string().meta({ example: 'São Paulo' }),
      stateCode: z.string().length(2).meta({ example: 'SP' }),
    }),
  );

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
