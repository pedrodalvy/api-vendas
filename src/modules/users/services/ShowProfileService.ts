import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  userId: string;
}

export class ShowProfileService {
  public async execute({ userId }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findById(userId);

    if (!user) {
      throw new AppError('User not found.');
    }

    return user;
  }
}
