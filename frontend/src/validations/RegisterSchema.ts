import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s]+$/, { message: "O nome não pode conter números." }).min(1, 'O nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'A confirmação de senha deve ter no mínimo 6 caracteres'),
    cpf: z
        .string()
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
            message: "O CPF deve conter 11 dígitos numéricos (com ou sem pontos e traços)."
        })
        .transform((val) => val.replace(/[^\d]/g, '')),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
