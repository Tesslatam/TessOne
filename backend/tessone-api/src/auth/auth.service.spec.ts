import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const company = await this.prisma.company.create({
      data: {
        name: data.companyName,
        ruc: data.ruc,
        email: data.companyEmail,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId: company.id,
        roleId: data.roleId || 1,
      },
    });

    const { password, ...userWithoutPassword } = user;

    return {
      company,
      user: userWithoutPassword,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      userId: user.id,
      companyId: user.companyId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
