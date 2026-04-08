import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateConfig(data: any, companyId: number) {
    const existing = await this.prisma.taxConfig.findUnique({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.taxConfig.update({
        where: { companyId },
        data: {
          defaultVatRate: Number(data.defaultVatRate),
          isActive: data.isActive ?? true,
        },
      });
    }

    return this.prisma.taxConfig.create({
      data: {
        companyId,
        defaultVatRate: Number(data.defaultVatRate),
        isActive: data.isActive ?? true,
      },
    });
  }

  async getConfig(companyId: number) {
    return this.prisma.taxConfig.findUnique({
      where: { companyId },
    });
  }

  async createRule(data: any, companyId: number) {
    if (
      !data.name ||
      data.vatRate === undefined ||
      !data.startDate ||
      !data.endDate
    ) {
      throw new BadRequestException(
        'Faltan campos obligatorios: name, vatRate, startDate, endDate',
      );
    }

    return this.prisma.taxRule.create({
      data: {
        companyId,
        name: data.name,
        vatRate: Number(data.vatRate),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isActive: data.isActive ?? true,
        description: data.description || null,
      },
    });
  }

  async findAllRules(companyId: number) {
    return this.prisma.taxRule.findMany({
      where: { companyId },
      orderBy: { startDate: 'desc' },
    });
  }

  async updateRule(id: number, data: any, companyId: number) {
    const result = await this.prisma.taxRule.updateMany({
      where: {
        id,
        companyId,
      },
      data: {
        name: data.name,
        vatRate: data.vatRate !== undefined ? Number(data.vatRate) : undefined,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        isActive: data.isActive,
        description: data.description,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Regla fiscal no encontrada o no pertenece a la empresa',
      );
    }

    return { message: 'Regla fiscal actualizada correctamente' };
  }

  async removeRule(id: number, companyId: number) {
    const result = await this.prisma.taxRule.deleteMany({
      where: {
        id,
        companyId,
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Regla fiscal no encontrada o no pertenece a la empresa',
      );
    }

    return { message: 'Regla fiscal eliminada correctamente' };
  }

  async getActiveVatRate(companyId: number, date?: Date) {
    const targetDate = date || new Date();

    const activeRule = await this.prisma.taxRule.findFirst({
      where: {
        companyId,
        isActive: true,
        startDate: { lte: targetDate },
        endDate: { gte: targetDate },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    if (activeRule) {
      return {
        source: 'RULE',
        vatRate: activeRule.vatRate,
        rule: activeRule,
      };
    }

    const config = await this.prisma.taxConfig.findUnique({
      where: { companyId },
    });

    return {
      source: 'DEFAULT',
      vatRate: config?.defaultVatRate ?? 15,
      rule: null,
    };
  }
}
