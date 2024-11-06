import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Param, Patch, Post, Put, UsePipes } from "@nestjs/common";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { CreateUserDto, createUserSchema } from "src/users/dtos/create-user.dto";
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto, updateUserSchema } from "./dtos/update-user.dto";
import { Validate } from "src/decorators/validate.decorator";
import { logError } from "src/logger/logger.singleton";

@Controller('/user')
export class UserController {
    constructor(private userRepository: UserRepository) { }
    @Post()
    @Validate(createUserSchema)
    @HttpCode(201)
    async handler(@Body() body: CreateUserDto) {
        try {
            const user = await this.userRepository.createUser(body);

            return user;

        } catch (error) {
            if (error instanceof ConflictException) {
                return error;
            }
            logError('Ocorreu um erro ao criar o usuário', error);
            throw new InternalServerErrorException('Erro inesperado no servidor', {
                description: 'Ocorreu um erro ao criar o usuário'
            });
        }
    }

    @Patch(':id')
    @Validate(updateUserSchema)
    @HttpCode(204)
    async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.userRepository.updateUser(Number(id), body);
    }
}