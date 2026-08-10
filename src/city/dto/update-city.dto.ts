import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateCitySchema = z
  .object({
    name: z.string().trim().min(1),
    stateId: z.number().int().positive(),
  })
  .partial();

export class UpdateCityDto extends createZodDto(updateCitySchema) {}
