import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const method = request.method;
    const url = request.originalUrl || request.url;

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any)?.message || 'Internal server error';

    console.error(`
[EXCEPTION FILTER]
Endpoint: ${method} ${url}
Status: ${status}
Message: ${Array.isArray(message) ? message.join(', ') : message}
==============================
`);

    response.status(status).json({
      statusCode: status,
      message,
      path: url,
      timestamp: new Date().toISOString(),
    });
  }
}
