import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const findAllStatesQuerySchema = z.object({
  cursor: z.coerce.number().int().positive().optional().meta({
    description: 'ID do último item da página anterior para paginação.',
    example: 10,
  }),
  limit: z.coerce.number().int().positive().max(100).default(20).meta({
    description: 'Quantidade máxima de itens por página (máx. 100).',
    example: 20,
  }),
});

export class FindAllStatesQueryDto extends createZodDto(
  findAllStatesQuerySchema,
) {}
