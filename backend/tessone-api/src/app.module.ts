import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { ProvidersModule } from './providers/providers.module';
import { AreasModule } from './areas/areas.module';
import { EmployeesModule } from './employees/employees.module';
import { TaxModule } from './tax/tax.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ProductsModule,
    ProvidersModule,
    AreasModule,
    EmployeesModule,
    TaxModule,
    InvoicesModule,
    MonitoringModule,
    DashboardModule,
    PositionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
