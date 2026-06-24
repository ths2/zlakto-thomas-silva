import { Module } from '@nestjs/common';
import { AwsS3Provider } from './providers/aws-s3.provider';

@Module({
  providers: [AwsS3Provider],
  exports: [AwsS3Provider],
})
export class CloudModule {}