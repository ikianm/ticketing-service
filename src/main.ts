import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './modules/shares/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppConfig from 'configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Ticketing')
    .setDescription('The ticketing API description')
    .setVersion('1.0')
    .addTag('ticketing')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(AppConfig().port);
}
bootstrap();
