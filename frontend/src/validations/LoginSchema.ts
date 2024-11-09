import { z } from 'zod';
export const loginSchema = z.object({
    email: z.string({
        required_error: "E-mail obrigatório.",
    }).email({ message: "Insira um endereço de e-mail válido." }),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;