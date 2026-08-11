import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const cityIdParamSchema = z.object({
  id: z.coerce.number().int().positive().meta({
    description: 'ID da cidade.',
    example: 1,
  }),
});

export class CityIdParamDto extends createZodDto(cityIdParamSchema) {}
