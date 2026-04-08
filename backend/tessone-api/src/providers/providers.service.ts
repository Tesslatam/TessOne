import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: number) {
    if (!data.name || !data.ruc || !data.email) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, ruc, email',
      );
    }

    return this.prisma.provider.create({
      data: {
        code: `PROV-${Date.now()}`,
        name: data.name,
        ruc: data.ruc,
        email: data.email,
        phone: data.phone || null,
        companyId,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.provider.findMany({
      where: { companyId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, data: any, companyId: number) {
    const result = await this.prisma.provider.updateMany({
      where: {
        id,
        companyId,
      },
      data: {
        name: data.name,
        ruc: data.ruc,
        email: data.email,
        phone: data.phone,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Proveedor no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Proveedor actualizado correctamente' };
  }

  async remove(id: number, companyId: number) {
    const result = await this.prisma.provider.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Proveedor no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Proveedor eliminado correctamente' };
  }
}
