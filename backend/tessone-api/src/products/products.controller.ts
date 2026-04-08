import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@UseGuards(JwtGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // 📦 Crear producto
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.productsService.create(body, req.user.companyId);
  }

  // 📋 Listar productos
  @Get()
  findAll(@Req() req: any) {
    return this.productsService.findAll(req.user.companyId);
  }

  // ✏️ Actualizar producto
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.productsService.update(
      Number(id),
      body,
      req.user.companyId,
    );
  }

  // 🗑️ Eliminar producto
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.productsService.remove(
      Number(id),
      req.user.companyId,
    );
  }
}