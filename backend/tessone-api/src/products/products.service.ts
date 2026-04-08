import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: any, companyId: number) {
    return this.prisma.product.create({
      data: {
        ...data,
        companyId,
      },
    });
  }

  findAll(companyId: number) {
    return this.prisma.product.findMany({
      where: { companyId },
    });
  }

update(id: number, data: any, companyId: number) {
  return this.prisma.product.updateMany({
    where: {
      id,
      companyId, // 🔐 seguridad multiempresa
    },
    data,
  });
}

remove(id: number, companyId: number) {
  return this.prisma.product.deleteMany({
    where: {
      id,
      companyId, // 🔐 seguridad
    },
  });
}
}
