import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Produto } from "@prisma/client";
import { CreateProductDto } from "../dtos/create-product.dto";

@Injectable()
export class ProductRepository {
    constructor(private prisma: PrismaService) { }

    async createProduct(data: CreateProductDto): Promise<Produto> {
        const hasUser = await this.prisma.user.findUnique({ where: { id: data.userId } });

        if (!hasUser) {
            throw new NotFoundException(`Usuário não encontrado.`);
        }

        return await this.prisma.produto.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                estoque: data.estoque,
                foto: data.foto,
                userId: data.userId
            },
        });
    }

    async findAll(userId?: number): Promise<Produto[]> {
        if (userId) {
            return await this.prisma.produto.findMany({ where: { id: userId } });
        }

        return await this.prisma.produto.findMany();
    }

    // // Buscar um produto pelo id
    // async findOne(id: number): Promise<Produto | null> {
    //     try {
    //         return await this.prisma.produto.findUnique({
    //             where: { id },
    //         });
    //     } catch (error) {
    //         throw new Error(`Erro ao buscar produto com id ${id}: ` + error.message);
    //     }
    // }

    // // Atualizar um produto
    // async updateProduto(id: number, data: UpdateProdutoDto): Promise<Produto> {
    //     try {
    //         return await this.prisma.produto.update({
    //             where: { id },
    //             data: {
    //                 nome: data.nome,
    //                 descricao: data.descricao,
    //                 preco: data.preco,
    //                 estoque: data.estoque,
    //                 foto: data.foto,
    //             },
    //         });
    //     } catch (error) {
    //         throw new Error(`Erro ao atualizar produto com id ${id}: ` + error.message);
    //     }
    // }

    // // Excluir um produto
    // async deleteProduto(id: number): Promise<Produto> {
    //     try {
    //         return await this.prisma.produto.delete({
    //             where: { id },
    //         });
    //     } catch (error) {
    //         throw new Error(`Erro ao excluir produto com id ${id}: ` + error.message);
    //     }
    // }

}