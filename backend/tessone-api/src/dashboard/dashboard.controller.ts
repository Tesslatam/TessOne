import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Permission('VIEW_KPI')
  @Get('summary')
  getSummary(@Req() req: any) {
    return this.service.getSummary(req.user.companyId);
  }

  @Permission('VIEW_KPI')
  @Get('top-products')
  getTopProducts(@Req() req: any) {
    return this.service.getTopProducts(req.user.companyId);
  }

  @Permission('VIEW_KPI')
  @Get('low-stock')
  getLowStock(@Req() req: any) {
    return this.service.getLowStock(req.user.companyId);
  }

  @Permission('VIEW_KPI')
  @Get('recent-invoices')
  getRecentInvoices(@Req() req: any) {
    return this.service.getRecentInvoices(req.user.companyId);
  }
}
