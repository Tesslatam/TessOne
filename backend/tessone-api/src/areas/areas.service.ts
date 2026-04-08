import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    if (!data.name) {
      throw new BadRequestException('El nombre es obligatorio');
    }

    const lastArea = await this.prisma.area.findFirst({
      orderBy: {
        hierarchyOrder: 'desc',
      },
    });

    const nextOrder = lastArea ? lastArea.hierarchyOrder + 1 : 1;

    return this.prisma.area.create({
      data: {
        name: data.name,
        hierarchyOrder: nextOrder,
        parentId: data.parentId ? Number(data.parentId) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.area.findMany({
      include: {
        _count: {
          select: {
            employees: true,
          },
        },
        parent: true,
      },
      orderBy: {
        hierarchyOrder: 'asc',
      },
    });
  }

  async update(id: number, data: any) {
    if (data.parentId && Number(data.parentId) === id) {
      throw new BadRequestException('Un área no puede depender de sí misma');
    }

    const result = await this.prisma.area.updateMany({
      where: { id },
      data: {
        name: data.name,
        hierarchyOrder:
          typeof data.hierarchyOrder === 'number'
            ? data.hierarchyOrder
            : undefined,
        parentId:
          data.parentId === '' || data.parentId === null
            ? null
            : data.parentId
            ? Number(data.parentId)
            : undefined,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException('Área no encontrada');
    }

    return { message: 'Área actualizada correctamente' };
  }

  async remove(id: number) {
    await this.prisma.area.updateMany({
      where: {
        parentId: id,
      },
      data: {
        parentId: null,
      },
    });

    const result = await this.prisma.area.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new BadRequestException('Área no encontrada');
    }

    return { message: 'Área eliminada correctamente' };
  }

  async reorder(items: { id: number; hierarchyOrder: number }[]) {
    for (const item of items) {
      await this.prisma.area.update({
        where: { id: item.id },
        data: {
          hierarchyOrder: item.hierarchyOrder,
        },
      });
    }

    return { message: 'Jerarquía de áreas actualizada correctamente' };
  }

  async updateParents(items: { id: number; parentId: number | null }[]) {
    for (const item of items) {
      if (item.parentId === item.id) {
        throw new BadRequestException('Un área no puede depender de sí misma');
      }

      await this.prisma.area.update({
        where: { id: item.id },
        data: {
          parentId: item.parentId,
        },
      });
    }

    return { message: 'Dependencias de áreas actualizadas correctamente' };
  }

  async findTree() {
    const areas = await this.prisma.area.findMany({
      include: {
        employees: true,
      },
      orderBy: {
        hierarchyOrder: 'asc',
      },
    });

    const map: Record<number, any> = {};
    const roots: any[] = [];

    areas.forEach((area) => {
      map[area.id] = {
        ...area,
        children: [],
      };
    });

    areas.forEach((area) => {
      if (area.parentId && map[area.parentId]) {
        map[area.parentId].children.push(map[area.id]);
      } else {
        roots.push(map[area.id]);
      }
    });

    const sortTree = (nodes: any[]) => {
      nodes.sort((a, b) => a.hierarchyOrder - b.hierarchyOrder);
      nodes.forEach((node) => sortTree(node.children));
    };

    sortTree(roots);

    return roots;
  }
}
