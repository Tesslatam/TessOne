import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly service: PositionsService) {}

  @Permission('CREATE_POSITION')
  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Permission('VIEW_POSITION')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permission('UPDATE_POSITION')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Permission('DELETE_POSITION')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
