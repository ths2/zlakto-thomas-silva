import { Injectable } from '@nestjs/common';
import { AwsS3Provider } from '../cloud/providers/aws-s3.provider';

@Injectable()
export class LogsService {
  constructor(
    private readonly storage: AwsS3Provider,
  ) {}

  async listLogs() {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error(
        'AWS_S3_BUCKET is not configured',
      );
    }

    return this.storage.listFiles(
      process.env.AWS_S3_BUCKET,
    );
  }

  async downloadLog(key: string) {
    if (!process.env.AWS_S3_BUCKET) {
      throw new Error(
        'AWS_S3_BUCKET is not configured',
      );
    }

    return this.storage.downloadFile(
      process.env.AWS_S3_BUCKET,
      key,
    );
  }
}