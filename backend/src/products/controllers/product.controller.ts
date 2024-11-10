import { Body, Controller, Post, HttpCode, InternalServerErrorException, NotFoundException, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, createProductSchema } from '../dtos/create-product.dto';
import { Validate } from 'src/decorators/validate.decorator';
import { logError } from 'src/logger/logger.singleton';
import { AuthGuard } from '@nestjs/passport';

@Controller('/produto')
export class ProductController {
    constructor(private productRepository: ProductRepository) { }

    @Post()
    @Validate(createProductSchema)
    @HttpCode(201)
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() request: CreateProductDto) {
        try {
            return await this.productRepository.createProduct(request);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            logError('Ocorreu um erro ao criar um produto', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Ocorreu um erro ao criar um produto'
            });
        }
    }

    @Get('all/:id?')
    @HttpCode(200)
    async findAll(@Param('id') userId?: number,) {
        const idUser = userId ? Number(userId) : undefined;
        return await this.productRepository.findAll(idUser);
    }

    @Get(':id')
    @HttpCode(200)
    async findOne(@Param('id') id: number,) {
        return await this.productRepository.findById(Number(id));
    }

    @Put(':id')
    @HttpCode(200)
    async updade(@Param('id') id: number, body: CreateProductDto) {
        return await this.productRepository.updateProduto(Number(id), body);
    }
}
