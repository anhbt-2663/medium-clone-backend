import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Lấy message từ exception (có thể là string hoặc object từ ValidationPipe)
    const messages =
      typeof exceptionResponse === 'string'
        ? [exceptionResponse]
        : ((exceptionResponse as any).message ?? [exception.message]);

    // Chuẩn hóa theo RealWorld spec
    response.status(status).json({
      errors: {
        body: Array.isArray(messages) ? messages : [messages],
      },
    });
  }
}
