import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { User } from '@modules/users/typeorm/entities/User';
import { AppError } from '@shared/errors/AppError';
import { compare } from 'bcryptjs';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
}

export class CreateSessionsService {
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findByEmail(email);

    if (!(user instanceof User)) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    return { user };
  }
}
