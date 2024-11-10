import { z } from 'zod';

export const registerClientSchema = z.object({
    nome: z.string().regex(/^[a-zA-Z\s]+$/, { message: "O nome não pode conter números." }).min(1, 'O nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
    cpf: z
        .string()
        .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
            message: "O CPF deve conter 11 dígitos numéricos (com ou sem pontos e traços)."
        })
        .transform((val) => val.replace(/[^\d]/g, '')),
});

export type RegisterClientFormData = z.infer<typeof registerClientSchema>;
