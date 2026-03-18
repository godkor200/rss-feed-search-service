import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { FeedsApiModule } from './feeds/feeds-api.module';

@Module({
  imports: [DatabaseModule, FeedsApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
