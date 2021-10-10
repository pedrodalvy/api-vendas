import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { UserTokensRepository } from '@modules/users/typeorm/repositories/UserTokensRepository';
import { AppError } from '@shared/errors/AppError';
import { EtherealMail } from '@config/mail/EtherealMail';
import path from 'node:path';

interface IRequest {
  email: string;
}

export class SendForgotPasswordEmailService {
  public async execute({ email }: IRequest): Promise<void> {
    const userRepository = getCustomRepository(UsersRepository);

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const userTokenRepository = getCustomRepository(UserTokensRepository);
    const newToken = await userTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: { name: user.name, email: user.email },
      subject: 'Password recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${newToken.token}`,
        },
      },
    });
  }
}
