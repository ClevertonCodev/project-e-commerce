import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './users/user.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module'
import { AuthController } from './auth/auth.controller';
import { UserRepository } from './users/repositories/user.repository';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true
  }),
    AuthModule,
    LoggerModule
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [PrismaService, UserRepository],
})
export class AppModule { }
