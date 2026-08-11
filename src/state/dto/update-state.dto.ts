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
      .regex(/^[A-Z]{2}$/)
      .meta({
        description: 'UF do estado (2 letras maiúsculas).',
        example: 'SP',
      }),
  })
  .partial();

export class UpdateStateDto extends createZodDto(updateStateSchema) {}
