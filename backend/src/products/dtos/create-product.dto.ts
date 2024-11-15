import { z } from 'zod';

export const createProductSchema = z.object({
    nome: z.string({
        required_error: "O nome é obrigatório.",
    }),
    descricao: z.string().optional(),
    preco: z.number({
        required_error: "O preço é obrigatório.",
    }).positive({ message: "O preço deve ser um número positivo." }),
    estoque: z.number({
        required_error: "O estoque é obrigatório.",
    }).int().nonnegative({ message: "O estoque deve ser um número inteiro não negativo." }),
    userId: z.number({
        required_error: "id do usuário é obrigatório",
    }),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
