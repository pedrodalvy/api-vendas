import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import { uploadConfig } from '@config/upload';
import { User } from '@modules/users/typeorm/entities/User';
import { DiskStorageProvider } from '@shared/providers/StorageProvider/DiskStorageProvider';
import { S3StorageProvider } from '@shared/providers/StorageProvider/S3StorageProvider';

interface IRequest {
  avatarFileName: string;
  userId: string;
}

export class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const storageProvider =
      uploadConfig.driver === 's3'
        ? new S3StorageProvider()
        : new DiskStorageProvider();

    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    const filename = await storageProvider.saveFile(avatarFileName);
    user.avatar = filename;

    return await repository.save(user);
  }
}
