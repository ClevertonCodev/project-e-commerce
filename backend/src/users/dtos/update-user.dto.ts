import { z } from 'zod';

export const updateUserSchema = z.object({
    nome: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    cpf: z.string().optional(),
    tipo: z.enum(['CLIENT', 'ADMIN']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
