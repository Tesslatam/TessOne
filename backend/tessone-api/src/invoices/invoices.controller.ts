import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

  @Permission('CREATE_INVOICE')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.companyId);
  }

  @Permission('VIEW_INVOICE')
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.companyId);
  }

  @Permission('VIEW_INVOICE_DETAIL')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.service.findOne(Number(id), req.user.companyId);
  }

  @Permission('CANCEL_INVOICE')
  @Put(':id/cancel')
  cancel(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.cancel(Number(id), req.user.companyId, body?.reason);
  }
}
