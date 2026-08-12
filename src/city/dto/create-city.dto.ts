import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCitySchema = z.object({
  name: z.string().trim().min(1).meta({
    description: 'Nome da cidade.',
    example: 'Campinas',
  }),
  stateCode: z
    .string()
    .length(2)
    .transform((v) => v.toUpperCase())
    .meta({
      description:
        'UF do estado ao qual a cidade pertence. Normalizado para maiúsculas.',
      example: 'SP',
    }),
});

export class CreateCityDto extends createZodDto(createCitySchema) {}
