import { z } from 'zod';

export const createClientSchema = z.object({
    nome: z.string({
        required_error: "O nome é obrigatório.",
    }),
    email: z.string({
        required_error: "E-mail obrigatório.",
    }).email({ message: "Insira um endereço de e-mail válido." }),
    cpf: z.string({
        required_error: "O CPF é obrigatório."
    }).regex(/^\d{11}$/, { message: "O CPF deve conter 11 dígitos numéricos." }),
});

export type CreateClientDto = z.infer<typeof createClientSchema>;
