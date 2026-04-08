import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Permission('CREATE_EMPLOYEE')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.companyId);
  }

  @Permission('VIEW_EMPLOYEE')
  @Get()
  findAll(
    @Req() req: any,
    @Query('areaId') areaId?: string,
    @Query('positionId') positionId?: string,
  ) {
    return this.service.findAll(req.user.companyId, {
      areaId: areaId ? Number(areaId) : undefined,
      positionId: positionId ? Number(positionId) : undefined,
    });
  }

  @Permission('UPDATE_EMPLOYEE')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.update(Number(id), body, req.user.companyId);
  }

  @Permission('DELETE_EMPLOYEE')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user.companyId);
  }
}
