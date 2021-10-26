import { AppError } from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import { hash } from 'bcryptjs';
import { IResetPassword } from '@modules/users/domain/models/IResetPassword';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';

@injectable()
export class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(
      tokenCreatedAt,
      Number(process.env.PASSWORD_RESET_EXPIRATION_HOURS),
    );

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await hash(password, 8);
    await this.usersRepository.save(user);
  }
}
