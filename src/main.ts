import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter'; // Import the filter
import { TransformInterceptor } from './shared/interceptors/transform.interceptor'; // Import the interceptor

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter()); // Apply the global exception filter
  app.useGlobalInterceptors(new TransformInterceptor()); // Apply the global response interceptor

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('The User Management API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
