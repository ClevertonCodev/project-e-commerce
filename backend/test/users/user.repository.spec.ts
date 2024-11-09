import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UserRepository } from "src/users/repositories/user.repository";


jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
}));

describe("UserRepository", () => {
    let userRepository: UserRepository;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findMany: jest.fn() as jest.Mock,
                            findUnique: jest.fn() as jest.Mock,
                            create: jest.fn() as jest.Mock,
                            update: jest.fn() as jest.Mock,
                        },
                    },
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
        prisma = module.get<PrismaService>(PrismaService);
    });

    describe("createUser", () => {
        it("should create a user with ADMIN role if no users exist", async () => {
            (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue('hashedPassword');

            const createUserDto: CreateUserDto = {
                nome: "Test User",
                email: "test@example.com",
                cpf: "12345678901",
                password: "password",
                tipo: UserRole.CLIENT,
            };

            await userRepository.createUser(createUserDto);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    nome: "Test User",
                    email: "test@example.com",
                    cpf: "12345678901",
                    password: "hashedPassword",
                    tipo: UserRole.ADMIN,
                },
            });
        });

        it("should create a user with CLIENT role if users exist", async () => {
            (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 1 }]);
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue('hashedPassword');

            const createUserDto: CreateUserDto = {
                nome: "Test User",
                email: "test@example.com",
                cpf: "12345678901",
                password: "password",
                tipo: UserRole.CLIENT,
            };

            await userRepository.createUser(createUserDto);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    nome: "Test User",
                    email: "test@example.com",
                    cpf: "12345678901",
                    password: "hashedPassword",
                    tipo: UserRole.CLIENT,
                },
            });
        });

        it("should throw ConflictException if email already exists", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: "test@example.com" });
            (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 1, email: "test@example.com" }]);
            const createUserDto: CreateUserDto = {
                nome: "Test User",
                email: "test@example.com",
                cpf: "12345678901",
                password: "password",
                tipo: UserRole.CLIENT,
            };

            await expect(userRepository.createUser(createUserDto)).rejects.toThrow(ConflictException);
        });
    });

    describe("createUserClient", () => {
        it("should create a user with CLIENT role", async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (hash as jest.Mock).mockResolvedValue("hashedPassword");

            const createUserDto: CreateUserDto = {
                nome: "Client User",
                email: "client@example.com",
                cpf: "09876543210",
                password: "password",
                tipo: UserRole.CLIENT,
            };

            await userRepository.createUserClient(createUserDto);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    nome: "Client User",
                    email: "client@example.com",
                    cpf: "09876543210",
                    password: "hashedPassword",
                    tipo: UserRole.CLIENT,
                },
            });
        });
    });

    describe("updateUser", () => {
        it("should update the user with new data", async () => {
            const updateUserDto = { nome: "Updated User" };
            (prisma.user.update as jest.Mock).mockResolvedValue([{ id: 1, ...updateUserDto }]);

            const result = await userRepository.updateUser(1, updateUserDto);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: updateUserDto,
            });
            expect(result).toEqual([{ id: 1, ...updateUserDto }]);
        });
    });
});
