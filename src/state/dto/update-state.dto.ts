import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateStateSchema = z
  .object({
    name: z.string().meta({
      description: 'Nome do estado.',
      example: 'São Paulo',
    }),
    stateCode: z
      .string()
      .length(2)
      .transform((v) => v.toUpperCase())
      .meta({
        description: 'UF do estado (2 letras). Normalizado para maiúsculas.',
        example: 'SP',
      }),
  })
  .partial();

export class UpdateStateDto extends createZodDto(updateStateSchema) {}
