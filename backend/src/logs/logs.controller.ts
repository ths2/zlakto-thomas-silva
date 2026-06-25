import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(
    private readonly logsService: LogsService,
  ) {}

  @Get()
  async listLogs() {
    return this.logsService.listLogs();
  }

  @Get('download/:key')
  async downloadLog(
    @Param('key') key: string,
    @Res() res: Response,
  ) {
    const file = await this.logsService.downloadLog(key);

    res.setHeader(
      'Content-Type',
      'text/plain',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${key}"`,
    );

    res.send(file);
  }
}