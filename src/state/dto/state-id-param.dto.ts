import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const stateIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export class StateIdParamDto extends createZodDto(stateIdParamSchema) {}
