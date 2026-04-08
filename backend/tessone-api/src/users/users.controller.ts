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
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('me')
  findMe(@Req() req: any) {
    return this.service.findMe(req.user.userId, req.user.companyId);
  }

  @Permission('CREATE_USER')
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.companyId);
  }

  @Permission('VIEW_USER')
  @Get()
  findAll(@Req() req: any) {
    return this.service.findAll(req.user.companyId);
  }

  @Permission('UPDATE_USER')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.update(Number(id), body, req.user.companyId);
  }

  @Permission('DELETE_USER')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.service.remove(Number(id), req.user.companyId);
  }
}
