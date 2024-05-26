import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  const config = new DocumentBuilder()
  .setTitle('Nest API')
  .setDescription('Simple Crud App')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();


// {
//   type: 'http',
//   scheme: 'bearer',
//   bearerFormat: 'JWT',
//   name: 'JWT',
//   description: 'Enter JWT token',
//   in: 'header',
// },
// 'JWT-auth', 