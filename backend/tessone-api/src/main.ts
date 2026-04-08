import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MonitoringService } from './monitoring/monitoring.service';
import { LoggingInterceptor } from './monitoring/logging/logging.interceptor';
import { HttpExceptionFilter } from './monitoring/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 CORS (IMPORTANTE para Vercel)
  app.enableCors({
    origin: true, // permite cualquier origen (dev + prod)
    credentials: true,
  });

  // 🔥 Monitoring (lo que ya tienes)
  const monitoringService = app.get(MonitoringService);

  app.useGlobalInterceptors(
    new LoggingInterceptor(monitoringService),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  // 🔥 PUERTO DINÁMICO (CRÍTICO PARA RENDER)
  const PORT = process.env.PORT || 10000;

  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Server running on port ${PORT}`);
}

bootstrap();
