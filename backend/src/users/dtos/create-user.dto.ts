import { z } from 'zod';

export const createUserSchema = z.object({
    nome: z.string({
        required_error: "O nome é obrigatório.",
    }),
    email: z.string({
        required_error: "E-mail obrigatório.",
    }).email({ message: "Insira um endereço de e-mail válido." }),
    password: z.string({
        required_error: "Senha é obrigatória."
    }).min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
    cpf: z.string({
        required_error: "O CPF é obrigatório."
    }).regex(/^\d{11}$/, { message: "O CPF deve conter 11 dígitos numéricos." }),
    tipo: z.enum(['CLIENT', 'ADMIN'], {
        invalid_type_error: "O usuário deve ser 'CLIENT' ou 'ADMIN'."
    }).default('CLIENT'),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
