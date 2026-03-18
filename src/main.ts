import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableShutdownHooks();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RSS Feed Search Service')
    .setDescription('RSS/feed collection, queue-based processing, and search-ready API')
    .setVersion('0.1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`🚀 Server listening on http://localhost:${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
