import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MonitoringService } from './monitoring/monitoring.service';
import { LoggingInterceptor } from './monitoring/logging/logging.interceptor';
import { HttpExceptionFilter } from './monitoring/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  const monitoringService = app.get(MonitoringService);

  app.useGlobalInterceptors(new LoggingInterceptor(monitoringService));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();
