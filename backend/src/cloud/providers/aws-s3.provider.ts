import { Injectable } from '@nestjs/common';
import {
  S3Client,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

import { CloudStorageProvider } from '../interfaces/cloud-storage.interface';

@Injectable()
export class AwsS3Provider
  implements CloudStorageProvider
{
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId:
          process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async listFiles(bucket: string) {
    const result = await this.client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
      }),
    );

    return (
      result.Contents?.map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || []
    );
  }

  async downloadFile(
    bucket: string,
    key: string,
  ) {
    throw new Error(
      'Not implemented yet',
    );
  }
}