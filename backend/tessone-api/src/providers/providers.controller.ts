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
import { ProvidersService } from './providers.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly service: ProvidersService) {}

  @Permission('CREATE_PROVIDER')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.companyId);
  }

  @Permission('VIEW_PROVIDER')
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.companyId);
  }

  @Permission('UPDATE_PROVIDER')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.update(Number(id), body, req.user.companyId);
  }

  @Permission('DELETE_PROVIDER')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user.companyId);
  }
}
