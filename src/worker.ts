import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerAppModule } from './worker-app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(WorkerAppModule);
  Logger.log('Worker application context started.', 'WorkerBootstrap');
}

bootstrap();
