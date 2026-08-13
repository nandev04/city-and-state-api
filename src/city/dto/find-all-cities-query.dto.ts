import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const findAllCitiesQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional().meta({
    description: 'ID do último item da página anterior para paginação.',
    example: 10,
  }),
  limit: z.coerce.number().int().positive().max(100).default(20).meta({
    description: 'Quantidade máxima de itens por página (máx. 100).',
    example: 20,
  }),
  stateCode: z
    .string()
    .length(2)
    .transform((v) => v.toUpperCase())
    .optional()
    .meta({
      description:
        'Filtra cidades pela UF do estado. Normalizado para maiúsculas.',
      example: 'SP',
    }),
  name: z.string().trim().min(1).optional().meta({
    description:
      'Filtra cidades cujo nome contém o texto informado (case-insensitive).',
    example: 'camp',
  }),
});

export class FindAllCitiesQueryDto extends createZodDto(
  findAllCitiesQuerySchema,
) {}
