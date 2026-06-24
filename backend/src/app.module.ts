import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LogsModule } from './logs/logs.module';
import { CloudModule } from './cloud/cloud.module';

@Module({
  imports: [AuthModule, UsersModule, LogsModule, CloudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
