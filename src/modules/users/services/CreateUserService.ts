import { User } from '@modules/users/typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  async execute({ name, email, password }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);

    const emailExists = await repository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const user = await repository.create({ name, email, password });
    await repository.save(user);

    return user;
  }
}
