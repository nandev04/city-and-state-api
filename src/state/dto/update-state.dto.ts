import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const updateStateSchema = z
  .object({
    name: z.string(),
    stateCode: z.string().regex(/^[A-Z]{2}$/),
  })
  .partial();

export class UpdateStateDto extends createZodDto(updateStateSchema) {}
