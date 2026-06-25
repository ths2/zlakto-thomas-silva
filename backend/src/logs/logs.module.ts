import { Module } from '@nestjs/common';

import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { CloudModule } from '../cloud/cloud.module';

@Module({
  imports: [CloudModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}