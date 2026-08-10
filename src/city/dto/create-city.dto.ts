import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCitySchema = z.object({
  name: z.string().trim().min(1),
  stateId: z.number().int().positive(),
});

export class CreateCityDto extends createZodDto(createCitySchema) {}
