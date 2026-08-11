import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCitySchema = z.object({
  name: z.string().trim().min(1).meta({
    description: 'Nome da cidade.',
    example: 'Campinas',
  }),
  stateId: z.number().int().positive().meta({
    description: 'ID do estado ao qual a cidade pertence.',
    example: 1,
  }),
});

export class CreateCityDto extends createZodDto(createCitySchema) {}
