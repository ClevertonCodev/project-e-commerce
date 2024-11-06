import { ConflictException, Injectable } from "@nestjs/common";
import { hash } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { User, UserRole } from "@prisma/client";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserDto): Promise<User> {
        const { nome, email, cpf, password, tipo } = data;
        const users = await this.prisma.user.findMany();
        const userType = users.length === 0 ? UserRole.ADMIN : tipo;

        return this.checkAndCreateUser(nome, email, cpf, password, userType);
    }

    async createUserClient(data: CreateUserDto): Promise<User> {
        const { nome, email, cpf, password } = data;
        const userType = UserRole.CLIENT;

        return this.checkAndCreateUser(nome, email, cpf, password, userType);
    }

    async updateUser(id: number, data: UpdateUserDto): Promise<User> {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }

    private async checkAndCreateUser(nome: string, email: string, cpf: string, password: string, tipo: UserRole): Promise<User> {
        const userWithSameEmail = await this.prisma.user.findUnique({ where: { email } });

        if (userWithSameEmail) {
            throw new ConflictException('Esse email já existe');
        }

        const hashedPassword = await hash(password, 8);
        return this.prisma.user.create({
            data: { nome, email, cpf, password: hashedPassword, tipo },
        });
    }
}


