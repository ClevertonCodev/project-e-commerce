import { Body, Controller, HttpCode, Post, UnauthorizedException } from "@nestjs/common";
import { z } from 'zod'
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { compare } from "bcryptjs";
import { Validate } from "src/decorators/validate.decorator";

const authenticateBodySchema = z.object({ email: z.string().email(), password: z.string() })
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
@Controller('/auth/login')
export class AuthController {
    constructor(private jwt: JwtService, private prisma: PrismaService) { }
    @Post()
    @HttpCode(200)
    @Validate(authenticateBodySchema)
    async handler(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user || !password) {
            throw new UnauthorizedException('As credenciais do usuário não correspondem.')
        }

        const isPasswordValid = await compare(password, user.password!)

        if (!isPasswordValid) {
            throw new UnauthorizedException('As credenciais do usuário não correspondem.')
        }
        const accessToken = this.jwt.sign({ sub: user.id, userType: user.tipo });
        return {
            access_token: accessToken,
        }
    }
}