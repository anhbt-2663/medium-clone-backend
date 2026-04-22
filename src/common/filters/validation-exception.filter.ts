import { ArgumentsHost, Catch } from '@nestjs/common';
import { I18nValidationException, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { Request } from 'express';

@Catch(I18nValidationException)
export class ValidationExceptionFilter extends I18nValidationExceptionFilter {
  protected buildResponseBody(
    host: ArgumentsHost,
    exc: I18nValidationException,
    errors: any[],
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    return {
      errors: {
        body: errors.flatMap((error) =>
          Object.values(error.constraints ?? {}).map((message) => ({
            property: error.property,
            message,
          })),
        ),
      },
      statusCode: exc.getStatus(),
      path: request.url,
    };
  }
}
