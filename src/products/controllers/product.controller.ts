import { Body, Controller, Post, HttpCode, InternalServerErrorException, NotFoundException, Get, Param } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, createProductSchema } from '../dtos/create-product.dto';
import { Validate } from 'src/decorators/validate.decorator';
import { logError } from 'src/logger/logger.singleton';

@Controller('/produto')
export class ProductController {
    constructor(private productRepository: ProductRepository) { }

    @Post()
    @Validate(createProductSchema)
    @HttpCode(201)
    async createProduto(@Body() body: CreateProductDto) {
        try {
            return await this.productRepository.createProduct(body);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return error;
            }
            logError('Ocorreu um erro ao criar um produto', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Ocorreu um erro ao criar um produto'
            });
        }
    }

    @Get(':id?')
    @HttpCode(200)
    async findAll(@Param('id') id?: number,) {
        const userId = id ? Number(id) : undefined;
        return await this.productRepository.findAll(userId);
    }
}
