import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(companyId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalClients = await this.prisma.client.count({
      where: { companyId },
    });

    const totalProducts = await this.prisma.product.count({
      where: { companyId },
    });

    const totalInvoices = await this.prisma.invoice.count({
      where: { companyId },
    });

    const monthlyInvoices = await this.prisma.invoice.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startOfMonth,
        },
        statusId: 2,
      },
      select: {
        total: true,
      },
    });

    const monthlyRevenue = monthlyInvoices.reduce(
      (acc, invoice) => acc + Number(invoice.total),
      0,
    );

    return {
      totalClients,
      totalProducts,
      totalInvoices,
      monthlyRevenue,
    };
  }

  async getTopProducts(companyId: number) {
    const details = await this.prisma.invoiceDetail.findMany({
      where: {
        invoice: {
          companyId,
          statusId: 2,
        },
      },
      include: {
        product: true,
      },
    });

    const grouped: Record<
      number,
      {
        productId: number;
        name: string;
        totalSold: number;
        totalRevenue: number;
      }
    > = {};

    for (const detail of details) {
      const productId = detail.productId;

      if (!grouped[productId]) {
        grouped[productId] = {
          productId,
          name: detail.product.name,
          totalSold: 0,
          totalRevenue: 0,
        };
      }

      grouped[productId].totalSold += Number(detail.quantity);
      grouped[productId].totalRevenue += Number(detail.subtotal);
    }

    return Object.values(grouped)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);
  }

  async getLowStock(companyId: number) {
    return this.prisma.product.findMany({
      where: {
        companyId,
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: 'asc',
      },
      take: 10,
    });
  }

  async getRecentInvoices(companyId: number) {
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
      take: 10,
    });
  }
}
