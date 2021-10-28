import { AppError } from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import { ICreateSession } from '@modules/users/domain/models/ICreateSession';
import { IUserAuthenticated } from '@modules/users/domain/models/IUserAuthenticated';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';

@injectable()
export class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateSession): Promise<IUserAuthenticated> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordConfirmed = await this.hashProvider.compareHash(
      password,
      user.password,
    );

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
