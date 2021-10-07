import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { User } from '@modules/users/typeorm/entities/User';
import { AppError } from '@shared/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

export class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const repository = getCustomRepository(UsersRepository);
    const user = await repository.findByEmail(email);

    if (!(user instanceof User)) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const token = sign({}, String(process.env.SECRET_KEY), {
      subject: user.id,
      expiresIn: process.env.SECRET_EXPIRES,
    });

    return { user, token };
  }
}
