import { Controller, Post, Body, Param, BadRequestException, NotFoundException, Get, HttpCode, InternalServerErrorException } from '@nestjs/common';
import { CartService } from 'src/cart/services/cart.service';
import { logError } from 'src/logger/logger.singleton';
import { CreateClientDto } from 'src/users/dtos/create-client.dto';
import { UserRepository } from '../../users/repositories/user.repository';
import { OrderRepository } from '../repositories/order.respository';

@Controller('pedido')
export class OrderController {
    constructor(
        private cartService: CartService,
        private userRepository: UserRepository,
        private orderRepository: OrderRepository) { }

    @Post('/carrinho/add')
    @HttpCode(200)
    async addCart(@Body() request: { products: { productId: number, qtty: number }[] }) {
        try {
            const { products } = request;
            return await this.cartService.addItems(products);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            logError('Erro ao adicionar produto ao carrinho.', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Erro ao adicionar produto ao carrinho.'
            });
        }
    }

    @Get('/chekout')
    @HttpCode(200)
    async getCart() {
        return this.cartService.getCart();
    }

    @Post('/salvar')
    @HttpCode(201)
    async save(@Body() request: CreateClientDto) {
        try {
            const clientWithCpf = await this.userRepository.getUserWinhCpf(request.cpf)
            const client = !clientWithCpf ? await this.userRepository.createUserClient(request) : clientWithCpf;
            if (!client) {
                throw new InternalServerErrorException('Erro inesperado no servidor');
            }
            const response = await this.orderRepository.save(client, this.cartService);
            return {
                success: response
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            logError('Erro ao adicionar produto ao carrinho.', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Erro ao adicionar produto ao carrinho.'
            });
        }
    }

    @Get()
    @HttpCode(201)
    async getOrders() {
        try {
            const clientWithCpf = await this.userRepository.getUserWinhCpf(request.cpf)
            const client = !clientWithCpf ? await this.userRepository.createUserClient(request) : clientWithCpf;
            if (!client) {
                throw new InternalServerErrorException('Erro inesperado no servidor');
            }
            const response = await this.orderRepository.save(client, this.cartService);
            return {
                success: response
            }
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            logError('Erro ao adicionar produto ao carrinho.', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Erro ao adicionar produto ao carrinho.'
            });
        }
    }
}
