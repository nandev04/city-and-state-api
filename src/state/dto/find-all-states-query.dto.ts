import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const findAllStatesQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export class FindAllStatesQueryDto extends createZodDto(
  findAllStatesQuerySchema,
) {}
