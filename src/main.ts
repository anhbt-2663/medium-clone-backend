import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints)[0] : 'Validation error',
          errorCode: error.contexts 
            ? Object.values(error.contexts)[0].code 
            : `VALIDATION_${error.property.toUpperCase()}`,
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter())
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Medium Clone API')
    .setDescription('The RealWorld Medium API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 'api/docs' is the path where Swagger UI will be hosted
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
