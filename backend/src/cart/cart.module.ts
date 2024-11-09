import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as session from 'express-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '../env'
import { CartService } from './services/cart.service';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderController } from 'src/order/controllers/order.controller';
import { OrderRepository } from 'src/order/repositories/order.respository';
import { UserRepository } from 'src/users/repositories/user.repository';

@Module({
    imports: [ConfigModule],
    providers: [CartService, PrismaService, ProductRepository, OrderRepository, UserRepository],
    controllers: [OrderController],
    exports: [CartService],
})
export class CartModule implements NestModule {
    constructor(private configService: ConfigService<Env, true>) { }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                session({
                    name: 'cart',
                    secret: this.configService.get<string>('SESSION_SECRET', { infer: true }),
                    resave: false,
                    saveUninitialized: false,
                    cookie: {
                        maxAge: 60 * 60 * 1000,
                        secure: false
                    },
                }),
            )
            .forRoutes('/pedido');
    }
}
