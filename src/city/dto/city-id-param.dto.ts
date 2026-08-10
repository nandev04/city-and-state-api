import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const cityIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export class CityIdParamDto extends createZodDto(cityIdParamSchema) {}
