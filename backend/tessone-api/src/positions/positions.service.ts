import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (!data.name) {
      throw new BadRequestException('El nombre es obligatorio');
    }

    return this.prisma.position.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.position.findMany({
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(id: number, data: any) {
    const result = await this.prisma.position.updateMany({
      where: { id },
      data: {
        name: data.name,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException('Cargo no encontrado');
    }

    return { message: 'Cargo actualizado correctamente' };
  }

  async remove(id: number) {
    const result = await this.prisma.position.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new BadRequestException('Cargo no encontrado');
    }

    return { message: 'Cargo eliminado correctamente' };
  }
}
