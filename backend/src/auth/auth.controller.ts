import { Body, ConflictException, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from 'zod'
import { JwtService } from "@nestjs/jwt";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { compare } from "bcryptjs";

const authenticateBodySchema = z.object({ email: z.string().email(), password: z.string().nullable() })
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
@Controller('/sessions')
export class AuthController {
    constructor(private jwt: JwtService, private prisma: PrismaService) { }
    @Post()
    @HttpCode(201)
    // @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handler(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user || !password) {
            throw new UnauthorizedException('user credentials do not match.')
        }

        const isPasswordValid = await compare(password, user.password!)

        if (!isPasswordValid) {
            throw new UnauthorizedException('user credentials do not match.')
        }
        const accessToken = this.jwt.sign({ sub: user.id, userType: user.tipo });
        return {
            access_token: accessToken,
        }
    }
}