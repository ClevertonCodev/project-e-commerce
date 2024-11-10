import { z } from 'zod';

export const registerProductSchema = z.object({
    nome: z.string({
        required_error: "O nome é obrigatório.",
    }).min(1, "O nome é obrigatório."),
    descricao: z.string().optional(),
    preco: z.number({
        required_error: "O preço é obrigatório.",
    }).positive({ message: "O preço deve ser um número positivo." }),
    estoque: z.coerce.number({
        required_error: "a quantidade é obrigatório.",
    }),
    userId: z.coerce.number({
        required_error: "id do usuário é obrigatório",
    }),
});

export type RegisterFormProduct = z.infer<typeof registerProductSchema>;
