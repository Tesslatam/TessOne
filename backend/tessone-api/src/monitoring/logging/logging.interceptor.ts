import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MonitoringService } from '../monitoring.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const method = request.method;
    const url = request.originalUrl || request.url;
    const endpointKey = `${method} ${url}`;

    const requestNumber = this.monitoringService.increment(endpointKey);
    const startedAt = Date.now();

    const user = request.user || null;
    const permissionName = request.permissionName || 'NONE';
    const permissionRequired = request.permissionRequired || 'PENDING';

    console.log(`
[REQUEST] #${requestNumber}
Endpoint: ${endpointKey}
User: ${user ? JSON.stringify(user) : 'No autenticado'}
Permission name: ${permissionName}
Permission required: ${permissionRequired}
IP: ${request.ip || 'N/A'}
------------------------------
`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startedAt;

        console.log(`
[RESPONSE OK] #${requestNumber}
Endpoint: ${endpointKey}
Status: ${response.statusCode}
Time: ${duration}ms
Total hits: ${this.monitoringService.getCount(endpointKey)}
==============================
`);
      }),
      catchError((error) => {
        const duration = Date.now() - startedAt;

        console.error(`
[RESPONSE ERROR] #${requestNumber}
Endpoint: ${endpointKey}
Status: ${error?.status || 500}
Time: ${duration}ms
Message: ${error?.message || 'Error'}
Permission name: ${request.permissionName || 'NONE'}
Permission required: ${request.permissionRequired || 'FAIL'}
Total hits: ${this.monitoringService.getCount(endpointKey)}
==============================
`);

        return throwError(() => error);
      }),
    );
  }
}
