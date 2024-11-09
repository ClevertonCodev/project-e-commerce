import { z } from 'zod';

export const orderSchema = z.object({
    status: z.enum(['PENDING', 'CANCELED', 'APPROVED']).default('PENDING'),
    clienteId: z.number({
        required_error: "id do usuário é obrigatório",
    }),
    descricao: z.string().optional(),
    preco: z.number({
        required_error: "O preço é obrigatório.",
    }).positive({ message: "O preço deve ser um número positivo." }),
    estoque: z.number({
        required_error: "O estoque é obrigatório.",
    }).int().nonnegative({ message: "O estoque deve ser um número inteiro não negativo." }),
    foto: z.string()
        .url({ message: "A foto deve ser uma URL válida." })
        .optional()
        .refine((foto) => !foto || foto.length <= 5 * 1024 * 1024, {
            message: "A foto deve ter no máximo 5 MB.",
        }),
});