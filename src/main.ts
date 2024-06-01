import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as compression from 'compression';
import { json } from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerConfig } from './config/swagger.config';
import { NotFoundExceptionFilter } from './exceptions/not-found-exception.filter';
import { BadRequestExceptionFilter } from './exceptions/bad-request-exception.filter';
import { ConflictExcepionFilter } from './exceptions/conflict-exception.filter';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized-exception.filter';
import { InternalServerErrorExceptionFilter } from './exceptions/internal-server-exception.filter';
import { NotAcceptableExceptionFilter } from './exceptions/not-acceptable-exception.filter';
import { ForbiddenExceptionFilter } from './exceptions/forbidden-resources-exception.filter';
import { ReqResInterceptor } from './shared/interceptors/req-res.intercepter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();
  app.use(json({ limit: '15mb' }));
  app.use(compression());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalFilters(new ConflictExcepionFilter());
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new InternalServerErrorExceptionFilter());
  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new NotAcceptableExceptionFilter());
  app.useGlobalInterceptors(new ReqResInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);

  const serverPort = configService.get('server.port');
  await app.listen(serverPort);
}
bootstrap();
