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
import { AreasService } from './areas.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { Permission } from '../auth/permission.decorator';

@UseGuards(JwtGuard, PermissionGuard)
@Controller('areas')
export class AreasController {
  constructor(private readonly service: AreasService) {}

  @Permission('CREATE_AREA')
  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Permission('VIEW_AREA')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Permission('VIEW_AREA')
  @Get('tree')
  findTree() {
    return this.service.findTree();
  }

  @Permission('UPDATE_AREA')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Permission('UPDATE_AREA')
  @Post('reorder')
  reorder(@Body() body: { items: { id: number; hierarchyOrder: number }[] }) {
    return this.service.reorder(body.items || []);
  }

  @Permission('UPDATE_AREA')
  @Post('parents')
  updateParents(@Body() body: { items: { id: number; parentId: number | null }[] }) {
    return this.service.updateParents(body.items || []);
  }

  @Permission('DELETE_AREA')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
