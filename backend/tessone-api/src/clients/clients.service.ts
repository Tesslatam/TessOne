import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: number) {
    if (!data.name || !data.identification || !data.personTypeId) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, identification, personTypeId',
      );
    }

    const lastClient = await this.prisma.client.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    const nextNumber = lastClient ? lastClient.id + 1 : 1;
    const code = `CLI-${nextNumber.toString().padStart(4, '0')}`;

    return this.prisma.client.create({
      data: {
        code,
        name: data.name,
        identification: data.identification,
        personTypeId: Number(data.personTypeId),
        passport: data.passport || null,
        email: data.email || null,
        companyId,
      },
      include: {
        personType: true,
      },
    });
  }

  async findAll(companyId: number) {
    return this.prisma.client.findMany({
      where: { companyId },
      include: {
        personType: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async update(id: number, data: any, companyId: number) {
    const result = await this.prisma.client.updateMany({
      where: {
        id,
        companyId,
      },
      data: {
        name: data.name,
        identification: data.identification,
        personTypeId: data.personTypeId
          ? Number(data.personTypeId)
          : undefined,
        passport: data.passport,
        email: data.email,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Cliente no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Cliente actualizado correctamente' };
  }

  async remove(id: number, companyId: number) {
    const result = await this.prisma.client.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Cliente no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Cliente eliminado correctamente' };
  }
}
