import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const stateIdParamSchema = z.object({
  id: z.coerce.number().int().positive().meta({
    description: 'ID do estado.',
    example: 1,
  }),
});

export class StateIdParamDto extends createZodDto(stateIdParamSchema) {}
