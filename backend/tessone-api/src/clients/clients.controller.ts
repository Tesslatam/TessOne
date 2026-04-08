import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Param, Put, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {
    const companyId = req.user.companyId;
    return this.clientsService.create(body, companyId);
  }

  @Get()
  findAll(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.clientsService.findAll(companyId);
  }

@Put(':id')
update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
  const companyId = req.user.companyId;
  return this.clientsService.update(Number(id), body, companyId);
}

@Delete(':id')
remove(@Param('id') id: string, @Req() req: any) {
  const companyId = req.user.companyId;
  return this.clientsService.remove(Number(id), companyId);
}

}
