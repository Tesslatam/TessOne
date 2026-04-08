import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, companyId: number) {
    if (!data.name || !data.positionId || !data.areaId) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, positionId, areaId',
      );
    }

    if (data.subAreaId) {
      const subArea = await this.prisma.area.findFirst({
        where: {
          id: Number(data.subAreaId),
          parentId: Number(data.areaId),
        },
      });

      if (!subArea) {
        throw new BadRequestException(
          'La subárea seleccionada no pertenece al área indicada',
        );
      }
    }

    if (data.isAreaManager) {
      const existingAreaManager = await this.prisma.employee.findFirst({
        where: {
          companyId,
          areaId: Number(data.areaId),
          isAreaManager: true,
        },
      });

      if (existingAreaManager) {
        throw new BadRequestException('Ya existe un jefe para esta área');
      }
    }

    if (data.managerId) {
      const manager = await this.prisma.employee.findFirst({
        where: {
          id: Number(data.managerId),
          companyId,
        },
      });

      if (!manager) {
        throw new BadRequestException('El jefe seleccionado no existe');
      }
    }

    return this.prisma.employee.create({
      data: {
        code: `EMP-${Date.now()}`,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        positionId: Number(data.positionId),
        areaId: Number(data.areaId),
        subAreaId: data.subAreaId ? Number(data.subAreaId) : null,
        companyId,
        managerId: data.managerId ? Number(data.managerId) : null,
        isAreaManager: !!data.isAreaManager,
      },
      include: {
        position: true,
        area: true,
        subArea: true,
        manager: true,
        subordinates: true,
      },
    });
  }

  async findAll(
    companyId: number,
    filters?: {
      areaId?: number;
      positionId?: number;
    },
  ) {
    return this.prisma.employee.findMany({
      where: {
        companyId,
        ...(filters?.areaId ? { areaId: filters.areaId } : {}),
        ...(filters?.positionId ? { positionId: filters.positionId } : {}),
      },
      include: {
        position: true,
        area: true,
        subArea: true,
        manager: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, data: any, companyId: number) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!employee) {
      throw new BadRequestException(
        'Empleado no encontrado o no pertenece a la empresa',
      );
    }

    const finalAreaId = data.areaId ? Number(data.areaId) : employee.areaId;

    if (data.subAreaId) {
      const subArea = await this.prisma.area.findFirst({
        where: {
          id: Number(data.subAreaId),
          parentId: finalAreaId,
        },
      });

      if (!subArea) {
        throw new BadRequestException(
          'La subárea seleccionada no pertenece al área indicada',
        );
      }
    }

    if (data.isAreaManager) {
      const existingAreaManager = await this.prisma.employee.findFirst({
        where: {
          companyId,
          areaId: finalAreaId,
          isAreaManager: true,
          NOT: {
            id,
          },
        },
      });

      if (existingAreaManager) {
        throw new BadRequestException('Ya existe un jefe para esta área');
      }
    }

    if (data.managerId) {
      if (Number(data.managerId) === id) {
        throw new BadRequestException('Un empleado no puede ser su propio jefe');
      }

      const manager = await this.prisma.employee.findFirst({
        where: {
          id: Number(data.managerId),
          companyId,
        },
      });

      if (!manager) {
        throw new BadRequestException('El jefe seleccionado no existe');
      }
    }

    const result = await this.prisma.employee.updateMany({
      where: {
        id,
        companyId,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        positionId: data.positionId ? Number(data.positionId) : undefined,
        areaId: data.areaId ? Number(data.areaId) : undefined,
        subAreaId:
          data.subAreaId === '' || data.subAreaId === null
            ? null
            : data.subAreaId
            ? Number(data.subAreaId)
            : undefined,
        managerId:
          data.managerId === '' || data.managerId === null
            ? null
            : data.managerId
            ? Number(data.managerId)
            : undefined,
        isAreaManager:
          typeof data.isAreaManager === 'boolean'
            ? data.isAreaManager
            : undefined,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Empleado no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Empleado actualizado correctamente' };
  }

  async remove(id: number, companyId: number) {
    const employee = await this.prisma.employee.findFirst({
      where: {
        id,
        companyId,
      },
    });

    if (!employee) {
      throw new BadRequestException(
        'Empleado no encontrado o no pertenece a la empresa',
      );
    }

    await this.prisma.employee.updateMany({
      where: {
        managerId: id,
        companyId,
      },
      data: {
        managerId: null,
      },
    });

    const result = await this.prisma.employee.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Empleado no encontrado o no pertenece a la empresa',
      );
    }

    return { message: 'Empleado eliminado correctamente' };
  }
}
