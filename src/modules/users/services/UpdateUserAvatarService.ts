import { AppError } from '@shared/errors/AppError';
import { uploadConfig } from '@config/upload';
import { DiskStorageProvider } from '@shared/providers/StorageProvider/DiskStorageProvider';
import { S3StorageProvider } from '@shared/providers/StorageProvider/S3StorageProvider';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IUpdateUserAvatar } from '@modules/users/domain/models/IUpdateUserAvatar';
import { IUser } from '@modules/users/domain/models/IUser';

@injectable()
export class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    avatarFileName,
  }: IUpdateUserAvatar): Promise<IUser> {
    const storageProvider =
      uploadConfig.driver === 's3'
        ? new S3StorageProvider()
        : new DiskStorageProvider();

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.avatar) {
      await storageProvider.deleteFile(user.avatar);
    }

    user.avatar = await storageProvider.saveFile(avatarFileName);

    return await this.usersRepository.save(user);
  }
}
