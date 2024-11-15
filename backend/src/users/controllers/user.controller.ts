import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Param, Patch, Post } from "@nestjs/common";
import { CreateUserDto, createUserSchema } from "src/users/dtos/create-user.dto";
import { Validate } from "src/decorators/validate.decorator";
import { logError } from "src/logger/logger.singleton";
import { updateUserSchema, UpdateUserDto } from "../dtos/update-user.dto";
import { UserRepository } from "../repositories/user.repository";

@Controller('/user')
export class UserController {
    constructor(private userRepository: UserRepository) { }
    @Post()
    @Validate(createUserSchema)
    @HttpCode(201)
    async handler(@Body() request: CreateUserDto) {
        try {
            const user = await this.userRepository.createUser(request);
            return user;

        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
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