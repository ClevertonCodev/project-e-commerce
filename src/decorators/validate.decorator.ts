import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { ZodSchema } from 'zod';

export function Validate(schema: ZodSchema) {
    return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
