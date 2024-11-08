import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './users/controllers/user.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module'
import { AuthController } from './auth/auth.controller';
import { UserRepository } from './users/repositories/user.repository';
import { LoggerModule } from './logger/logger.module';
import { ProductController } from './products/controllers/product.controller';
import { ProductRepository } from './products/repositories/product.repository';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true
  }),
    AuthModule,
    LoggerModule,
    CartModule
  ],
  controllers: [AppController, UserController, AuthController, ProductController],
  providers: [PrismaService, UserRepository, ProductRepository],
})
export class AppModule { }
