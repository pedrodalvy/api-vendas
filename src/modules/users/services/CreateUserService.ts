import { User } from '@modules/users/infra/typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { AppError } from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const repository = getCustomRepository(UsersRepository);

    const emailExists = await repository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await repository.create({
      name,
      email,
      password: hashedPassword,
    });

    await repository.save(user);

    return user;
  }
}
