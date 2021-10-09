import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import path from 'node:path';
import { uploadConfig } from '@config/upload';
import * as fs from 'node:fs';
import { User } from '@modules/users/typeorm/entities/User';

interface IRequest {
  avatarFileName: string;
  userId: string;
}

export class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.avatar) {
      await this.removePreviousAvatar(user);
    }

    user.avatar = avatarFileName;

    return await repository.save(user);
  }

  private async removePreviousAvatar(user: User): Promise<void> {
    const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
    const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

    if (userAvatarFileExists) {
      await fs.promises.unlink(userAvatarFilePath);
    }
  }
}
