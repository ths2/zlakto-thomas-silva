export interface CloudStorageProvider {
  listFiles(bucket: string): Promise<any[]>;
  downloadFile(bucket: string, key: string): Promise<any>;
  generatePresignedUrl?(
    bucket: string,
    key: string,
  ): Promise<string>;
}