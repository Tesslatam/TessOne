import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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
    if (
      !data.name ||
      !data.email ||
      !data.password ||
      !data.companyName ||
      !data.ruc ||
      !data.companyEmail
    ) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, email, password, companyName, ruc, companyEmail',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese correo');
    }

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
      message: 'Usuario registrado correctamente',
      company,
      user: userWithoutPassword,
    };
  }

  async login(email: string, password: string) {
    console.log('LOGIN ATTEMPT:', email);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('USER FOUND:', user);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('PASSWORD VALID:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      userId: user.id,
      companyId: user.companyId,
    };

    console.log('JWT PAYLOAD:', payload);

    const token = this.jwtService.sign(payload);

    console.log('TOKEN CREATED OK');

    return {
      access_token: token,
    };
  }
}
