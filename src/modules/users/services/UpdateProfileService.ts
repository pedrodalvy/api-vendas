import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { User } from '@modules/users/typeorm/entities/User';

interface IRequest {
  userId: string;
  name: string;
  email: string;
  password?: string;
  oldPassword?: string;
}

export class UpdateProfileService {
  public async execute({
    userId,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const userUpdateEmail = await repository.findByEmail(email);
    if (userUpdateEmail && userUpdateEmail.id !== userId) {
      throw new AppError('There is already one user with this email.');
    }

    if (password && !oldPassword) {
      throw new AppError('Old password is required.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    return repository.save(user);
  }
}
