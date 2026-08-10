import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const findAllCitiesQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  stateCode: z.string().length(2).optional(),
});

export class FindAllCitiesQueryDto extends createZodDto(
  findAllCitiesQuerySchema,
) {}
