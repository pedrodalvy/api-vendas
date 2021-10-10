import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { UserTokensRepository } from '@modules/users/typeorm/repositories/UserTokensRepository';
import { AppError } from '@shared/errors/AppError';
import { EtherealMail } from '@config/mail/EtherealMail';

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
    const token = await userTokenRepository.generate(user.id);

    await EtherealMail.sendMail({
      to: { name: user.name, email: user.email },
      subject: 'Password recovery',
      templateData: {
        template: `<p> Name: {{name}}</p><p> Token: {{token}}</p>`,
        variables: {
          name: user.name,
          token: token.token,
        },
      },
    });
  }
}
