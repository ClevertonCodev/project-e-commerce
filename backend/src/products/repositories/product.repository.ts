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
                userId: data.userId
            },
        });
    }

    async findAll(userId?: number): Promise<Produto[]> {
        if (userId) {
            return await this.prisma.$queryRaw`
                SELECT 
                    p.*, 
                    u.nome AS nome_usuario
                FROM 
                    produtos p
                LEFT JOIN 
                    users u ON p."userId" = u.id
                WHERE 
                    p."userId" = ${userId}
            `;
        }

        return await this.prisma.produto.findMany();
    }

    async findById(id: number): Promise<Produto | null> {
        return await this.prisma.produto.findUnique({
            where: { id },
        });
    }

    async updateProduto(id: number, data: CreateProductDto): Promise<Produto> {
        const product = await this.findById(id);

        if (!product) {
            throw new NotFoundException(`Produto não encontrado.`);
        }

        return await this.prisma.produto.update({
            where: { id },
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,
                estoque: data.estoque,
            },
        });
    }

    async deleteProduto(id: number): Promise<Produto> {
        const product = await this.findById(id);

        if (!product) {
            throw new NotFoundException(`Produto não encontrado.`);
        }
        return await this.prisma.produto.delete({
            where: { id },
        });
    }
}