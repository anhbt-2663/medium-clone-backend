import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const messages =
      typeof exceptionResponse === 'string'
        ? [exceptionResponse]
        : ((exceptionResponse as any).message ?? [exception.message]);

    response.status(status).json({
      errors: {
        body: Array.isArray(messages) ? messages : [messages],
      },
      statusCode: status,
      path: request.url,
    });
  }
}
