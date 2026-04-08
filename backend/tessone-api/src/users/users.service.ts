import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: number) {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, email, password',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyId,
        roleId: data.roleId || 1,
      },
      include: {
        role: true,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.user.findMany({
      where: { companyId },
      include: {
        role: true,
        company: true,
        employee: {
          include: {
            position: true,
            area: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMe(userId: number, companyId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        companyId,
      },
      include: {
        role: true,
        company: true,
        employee: {
          include: {
            position: true,
            area: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, data: any, companyId: number) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      roleId: data.roleId ? Number(data.roleId) : undefined,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const result = await this.prisma.user.updateMany({
      where: {
        id,
        companyId,
      },
      data: updateData,
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Usuario no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(id: number, companyId: number) {
    const result = await this.prisma.user.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Usuario no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Usuario eliminado correctamente' };
  }
}
