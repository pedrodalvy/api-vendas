import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import path from 'node:path';
import { uploadConfig } from '@config/upload';
import * as fs from 'node:fs';
import { User } from '@modules/users/typeorm/entities/User';
import { DiskStorageProvider } from '@shared/providers/StorageProvider/DiskStorageProvider';

interface IRequest {
  avatarFileName: string;
  userId: string;
}

export class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const storageProvider = new DiskStorageProvider();

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
