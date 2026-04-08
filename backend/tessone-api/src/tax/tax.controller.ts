import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaxService } from './tax.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('tax')
export class TaxController {
  constructor(private readonly service: TaxService) {}

  @Permission('VIEW_TAX_CONFIG')
  @Get('config')
  getConfig(@Req() req: any) {
    return this.service.getConfig(req.user.companyId);
  }

  @Permission('UPDATE_TAX_CONFIG')
  @Post('config')
  createOrUpdateConfig(@Body() body: any, @Req() req: any) {
    return this.service.createOrUpdateConfig(body, req.user.companyId);
  }

  @Permission('CREATE_TAX_RULE')
  @Post('rules')
  createRule(@Body() body: any, @Req() req: any) {
    return this.service.createRule(body, req.user.companyId);
  }

  @Permission('VIEW_TAX_RULE')
  @Get('rules')
  findAllRules(@Req() req: any) {
    return this.service.findAllRules(req.user.companyId);
  }

  @Permission('UPDATE_TAX_RULE')
  @Put('rules/:id')
  updateRule(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.updateRule(Number(id), body, req.user.companyId);
  }

  @Permission('DELETE_TAX_RULE')
  @Delete('rules/:id')
  removeRule(@Param('id') id: string, @Req() req: any) {
    return this.service.removeRule(Number(id), req.user.companyId);
  }

  @Permission('VIEW_TAX_RULE')
  @Get('active-rate')
  getActiveRate(@Req() req: any) {
    return this.service.getActiveVatRate(req.user.companyId);
  }
}
