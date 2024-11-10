import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma, Status, User } from "@prisma/client";
import { CartService } from "src/cart/services/cart.service";
import { logError } from "src/logger/logger.singleton";
import { PrismaService } from "src/prisma/prisma.service";
export class OrderRepository {

    private prisma = new PrismaService();

    async save(client: User, carrinho: CartService) {
        const cart = carrinho.getCart();

        if (!client.id) {
            throw new NotFoundException('Cliente não encontrado');
        }

        try {
            await this.prisma.$transaction(async (prisma) => {
                const order = await this.createOrder(client.id, carrinho.getTotal());

                if (!order) {
                    throw new BadRequestException('Erro ao salvar pedido');
                }

                for (const item of cart.items) {
                    for (let i = 0; i < item.qtty; i++) {
                        await this.createOrderProduct(order.id, item.productId, item.price);
                    }
                }

                await this.updateOrder(order.id, undefined, undefined, Status.APPROVED);
            });
            carrinho.clear();
            return true;
        } catch (error) {
            logError('Erro ao adicionar produto ao carrinho.', error);
            throw new BadRequestException('Falha ao salvar o pedido.');
        }
    }

    async createOrder(clientId: number, total: number) {
        return this.prisma.pedido.create({
            data: {
                clienteId: clientId,
                status: Status.PENDING,
                valor: total,
            },
        });
    }

    async updateOrder(
        id: number,
        clientId?: number,
        total?: number,
        status?: Status,
        deleted: boolean = false
    ) {
        const pedido = await this.prisma.pedido.findUnique({ where: { id } });
        if (!pedido) {
            throw new NotFoundException('Pedido não existe');
        }

        const updatedStatus = deleted ? Status.CANCELED : (status || pedido.status);

        return this.prisma.pedido.update({
            where: { id },
            data: {
                clienteId: clientId || pedido.clienteId,
                status: updatedStatus,
                valor: total || pedido.valor,
            },
        });
    }

    async createOrderProduct(orderId: number, productId: number, money: number) {

        const product = await this.prisma.produto.findUnique({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException('Produto não existe');
        }

        return await this.prisma.pedidoProduto.create({
            data: {
                pedidoId: orderId,
                produtoId: productId,
                valor: money,
            } as Prisma.PedidoProdutoUncheckedCreateInput
        });
    }

    async updadeOrderProduct(id: number, orderId?: number, productId?: number, money?: number) {

        const orderProduct = await this.prisma.pedidoProduto.findUnique({ where: { id: id } });

        if (!orderProduct) {
            throw new NotFoundException('item não existe');
        }

        return await this.prisma.pedidoProduto.update({
            where: { id },
            data: {
                pedidoId: orderId || orderProduct.pedidoId,
                produtoId: productId || orderProduct.produtoId,
                valor: money || orderProduct.valor,
            } as Prisma.PedidoProdutoUncheckedCreateInput
        });
    }

    async findAll(userId?: number) {
        if (userId) {
            return await this.prisma.$queryRaw`
                SELECT 
                    pe.id AS pedido_id,
                    pe.data AS pedido_data,
                    pe.status AS pedido_status,
                    u.nome AS nome_usuario,
                    u.id AS id_user,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'produto_id', p.id,
                            'produto_nome', p.nome,
                            'produto_descricao', p.descricao,
                            'pedido_produto_valor', pp.valor
                        )
                    ) AS items
                FROM 
                    pedidos pe
                LEFT JOIN 
                    pedido_produtos pp ON pe.id = pp."pedidoId"
                LEFT JOIN 
                    produtos p ON pp."produtoId" = p.id
                LEFT JOIN 
                    users u ON pe."clienteId" = u.id
                WHERE 
                    pe."clienteId" = CAST(${userId} AS INTEGER)
                GROUP BY
                    pe.id, pe.data, pe.status, u.nome, u.id
            `;
        }

        return await this.prisma.$queryRaw`
            SELECT 
                pe.id AS pedido_id,
                pe.data AS pedido_data,
                pe.status AS pedido_status,
                u.nome AS nome_usuario,
                u.id AS id_user,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'produto_id', p.id,
                        'produto_nome', p.nome,
                        'produto_descricao', p.descricao,
                        'pedido_produto_valor', pp.valor
                    )
                ) AS items
            FROM 
                pedidos pe
            LEFT JOIN 
                pedido_produtos pp ON pe.id = pp."pedidoId"
            LEFT JOIN 
                produtos p ON pp."produtoId" = p.id
            LEFT JOIN 
                users u ON pe."clienteId" = u.id
            GROUP BY
                pe.id, pe.data, pe.status, u.nome, u.id
        `;
    }

}