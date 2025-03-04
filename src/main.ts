import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as session from 'express-session';
import helmet from 'helmet';
import { ResInterceptor } from './logger.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: ['error', 'log', 'warn'],
  });
  //TODO change when using fastify
  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Allow frontend domain
    credentials: true, // Allow cookies & auth headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  //TODO change when using fastify
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableShutdownHooks();
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new ResInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('EVENTHUB')
    .setDescription('The EVENTHUB API description')
    .setVersion('1')
    .addTag('EVENTHUB')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
