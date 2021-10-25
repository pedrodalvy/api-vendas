import { uploadConfig } from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import fs from 'node:fs';
import path from 'node:path';
import { env } from 'node:process';
import mime from 'mime';
import { AppError } from '@shared/errors/AppError';

export class S3StorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({ region: env.AWS_REGION });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new AppError('File not found.');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}
