import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createStateSchema = z.object({
  name: z.string(),
  stateCode: z.string().length(2),
});

export class CreateStateDto extends createZodDto(createStateSchema) {}
