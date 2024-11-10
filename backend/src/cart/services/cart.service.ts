import { Injectable, Scope, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { ProductRepository } from '../../products/repositories/product.repository';

interface CartItem {
    productId: number;
    name: string;
    qtty: number;
    price: number;
    totalPrice: number;
}

type PaymentMethod = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

@Injectable({ scope: Scope.REQUEST })
export class CartService {
    private readonly sessionKey = 'CARRINHO_SESSION_KEY';
    private items: CartItem[] = [];
    private payment: PaymentMethod = 'PIX';
    constructor(@Inject(REQUEST) private readonly request: Request, private productRepository: ProductRepository) { this.getCart() }

    commit() {
        this.request.session[this.sessionKey] = this.cart();
        return this.request.session[this.sessionKey];
    }

    cart() {
        if (!this.request.session) {
            throw new Error('Sessão não inicializada.');
        }
        return {
            items: this.items,
            payment: this.payment
        };
    }

    getCart() {
        if (!this.request.session[this.sessionKey]) {
            return {
                items: this.items,
                payment: this.payment
            };
        }
        this.items = this.request.session[this.sessionKey].items;
        this.payment = this.request.session[this.sessionKey].payment
        return this.request.session[this.sessionKey] || { items: [], payment: 'PIX' };
    }

    async addItems(products: { productId: number, qtty: number }[]) {
        const notFoundProducts: number[] = [];
        const insufficientStockProducts: { productId: number, productName: string, productStock: number }[] = [];

        for (const productData of products) {
            const { productId, qtty } = productData;

            const product = await this.productRepository.findById(productId);

            if (!product) {
                notFoundProducts.push(productId);
                continue;
            }

            if (product.estoque < qtty) {
                insufficientStockProducts.push({
                    productId,
                    productName: product.nome,
                    productStock: product.estoque,
                });
                continue;
            }

            const totalPrice = product.preco * qtty;

            const existingItemIndex = this.items.findIndex(item => item.productId === productId);

            if (existingItemIndex > -1) {
                this.items[existingItemIndex].qtty += qtty;
                this.items[existingItemIndex].totalPrice += totalPrice;
            } else {
                this.items.push({
                    productId,
                    name: product.nome,
                    qtty,
                    price: product.preco,
                    totalPrice,
                });
            }
        }

        if (notFoundProducts.length > 0) {
            throw new NotFoundException(`Produtos não encontrados: ${notFoundProducts.join(', ')}`);
        }

        if (insufficientStockProducts.length > 0) {
            const errorMessage = insufficientStockProducts
                .map(item => `Produto ${item.productId}, ${item.productName}, ${item.productStock}`)
                .join(', ');
            throw new BadRequestException(`Estoque insuficiente para os seguintes produtos: ${errorMessage}`);
        }
        return this.commit();
    }


    setPayment(method: PaymentMethod) {
        this.payment = method;
        return this.commit();
    }

    clear() {
        this.items = [];
        this.payment = 'PIX';
        return this.commit();
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + item.totalPrice, 0);
    }
}
