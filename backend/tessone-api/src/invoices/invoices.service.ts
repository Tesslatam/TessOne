import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaxService } from '../tax/tax.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private taxService: TaxService,
  ) {}

  async create(data: any, companyId: number) {
    if (
      !data.clientId ||
      !data.employeeId ||
      !data.items ||
      !Array.isArray(data.items) ||
      data.items.length === 0
    ) {
      throw new BadRequestException(
        'Faltan campos obligatorios: clientId, employeeId, items',
      );
    }

    const client = await this.prisma.client.findFirst({
      where: {
        id: Number(data.clientId),
        companyId,
      },
    });

    if (!client) {
      throw new BadRequestException('Cliente no encontrado');
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        id: Number(data.employeeId),
        companyId,
      },
    });

    if (!employee) {
      throw new BadRequestException('Empleado no encontrado');
    }

    const emittedStatus = await this.prisma.invoiceStatus.findUnique({
      where: { id: 2 },
    });

    if (!emittedStatus) {
      throw new BadRequestException(
        'No existe el estado de factura EMITIDA con id 2',
      );
    }

    let subtotal = 0;
    const detailData: any[] = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: Number(item.productId),
          companyId,
        },
      });

      if (!product) {
        throw new BadRequestException(
          `Producto no encontrado: ${item.productId}`,
        );
      }

      const quantity = Number(item.quantity);

      if (quantity <= 0) {
        throw new BadRequestException(
          `Cantidad inválida para producto ${product.name}`,
        );
      }

      if (product.stock < quantity) {
        throw new BadRequestException(
          `Stock insuficiente para producto ${product.name}`,
        );
      }

      const lineSubtotal = Number(product.price) * quantity;
      subtotal += lineSubtotal;

      detailData.push({
        productId: product.id,
        quantity,
        unitPrice: Number(product.price),
        subtotal: lineSubtotal,
      });
    }

    const taxInfo = await this.taxService.getActiveVatRate(companyId);
    const vatRate = Number(taxInfo.vatRate);
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    const invoice = await this.prisma.invoice.create({
      data: {
        code: `INV-${Date.now()}`,
        companyId,
        clientId: Number(data.clientId),
        employeeId: Number(data.employeeId),
        subtotal,
        vatRate,
        vatAmount,
        total,
        statusId: 2,
        details: {
          create: detailData,
        },
      },
      include: {
        client: true,
        employee: true,
        status: true,
        details: {
          include: {
            product: true,
          },
        },
      },
    });

    for (const item of data.items) {
      const product = await this.prisma.product.findFirst({
        where: {
          id: Number(item.productId),
          companyId,
        },
      });

      if (product) {
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - Number(item.quantity),
          },
        });
      }
    }

    return invoice;
  }

  async findAll(companyId: number) {
    return this.prisma.invoice.findMany({
      where: { companyId },
      include: {
        client: true,
        employee: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number, companyId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        client: true,
        employee: true,
        status: true,
        details: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new BadRequestException('Factura no encontrada');
    }

    return invoice;
  }

  async cancel(id: number, companyId: number, reason?: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        id,
        companyId,
      },
      include: {
        details: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new BadRequestException('Factura no encontrada');
    }

    if (invoice.statusId === 3) {
      throw new BadRequestException('La factura ya está anulada');
    }

    const cancelledStatus = await this.prisma.invoiceStatus.findUnique({
      where: { id: 3 },
    });

    if (!cancelledStatus) {
      throw new BadRequestException(
        'No existe el estado de factura ANULADA con id 3',
      );
    }

    for (const detail of invoice.details) {
      const product = await this.prisma.product.findUnique({
        where: { id: detail.productId },
      });

      if (product) {
        await this.prisma.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock + detail.quantity,
          },
        });
      }
    }

    return this.prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        statusId: 3,
        cancelReason: reason || 'Anulación manual',
        cancelledAt: new Date(),
      },
      include: {
        client: true,
        employee: true,
        status: true,
        details: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
