import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  const config=new DocumentBuilder().setTitle('EVENTHUB').setDescription('The EVENTHUB API description').setVersion('1').addTag('EVENTHUB').build();
  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
