import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { FeedsWorkerModule } from './feeds/feeds-worker.module';

@Module({
  imports: [DatabaseModule, FeedsWorkerModule],
})
export class WorkerAppModule {}
