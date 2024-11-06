import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"; // Ajuste o caminho conforme sua estrutura de diretórios
import { Produto } from "@prisma/client"; // Tipo gerado pelo Prisma para o modelo Produto
import { CreateProdutoDto } from "src/products/dtos/create-produto.dto"; // DTO de criação de produto
import { UpdateProdutoDto } from "src/products/dtos/update-produto.dto"; // DTO de atualização de produto

@Injectable()
export class ProductRepository {
    constructor(private readonly prisma: PrismaService) { }

    // Criação de um produto
    async createProduto(data: CreateProdutoDto): Promise<Produto> {
        try {
            return await this.prisma.produto.create({
                data: {
                    nome: data.nome,
                    descricao: data.descricao,
                    preco: data.preco,
                    estoque: data.estoque,
                    foto: data.foto,
                },
            });
        } catch (error) {
            throw new Error("Erro ao criar produto: " + error.message);
        }
    }

    // Buscar todos os produtos
    async findAll(): Promise<Produto[]> {
        try {
            return await this.prisma.produto.findMany();
        } catch (error) {
            throw new Error("Erro ao buscar produtos: " + error.message);
        }
    }

    // Buscar um produto pelo id
    async findOne(id: number): Promise<Produto | null> {
        try {
            return await this.prisma.produto.findUnique({
                where: { id },
            });
        } catch (error) {
            throw new Error(`Erro ao buscar produto com id ${id}: ` + error.message);
        }
    }

    // Atualizar um produto
    async updateProduto(id: number, data: UpdateProdutoDto): Promise<Produto> {
        try {
            return await this.prisma.produto.update({
                where: { id },
                data: {
                    nome: data.nome,
                    descricao: data.descricao,
                    preco: data.preco,
                    estoque: data.estoque,
                    foto: data.foto,
                },
            });
        } catch (error) {
            throw new Error(`Erro ao atualizar produto com id ${id}: ` + error.message);
        }
    }

    // Excluir um produto
    async deleteProduto(id: number): Promise<Produto> {
        try {
            return await this.prisma.produto.delete({
                where: { id },
            });
        } catch (error) {
            throw new Error(`Erro ao excluir produto com id ${id}: ` + error.message);
        }
    }

    // Buscar produtos por nome
    async findByName(name: string): Promise<Produto[]> {
        try {
            return await this.prisma.produto.findMany({
                where: {
                    nome: {
                        contains: name,
                        mode: 'insensitive', // Ignora diferenças de maiúsculas/minúsculas
                    },
                },
            });
        } catch (error) {
            throw new Error(`Erro ao buscar produto com nome ${name}: ` + error.message);
        }
    }
}


import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { CreateProdutoDto } from "./dtos/create-produto.dto";
import { UpdateProdutoDto } from "./dtos/update-produto.dto";
import { Produto } from "@prisma/client";

@Injectable()
export class ProductService {
    constructor(private readonly productRepository: ProductRepository) { }

    async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
        return this.productRepository.createProduto(createProdutoDto);
    }

    async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
        return this.productRepository.updateProduto(id, updateProdutoDto);
    }

    async findAll(): Promise<Produto[]> {
        return this.productRepository.findAll();
    }

    async findById(id: number): Promise<Produto | null> {
        return this.productRepository.findOne(id);
    }

    async remove(id: number): Promise<Produto> {
        return this.productRepository.deleteProduto(id);
    }
}
