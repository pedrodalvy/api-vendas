import { AppError } from '@shared/errors/AppError';
import { EtherealMail } from '@config/mail/EtherealMail';
import path from 'node:path';
import { mailConfig } from '@config/mail/mail';
import { SESMail } from '@config/mail/SESMail';
import { ISendForgotPasswordEmail } from '@modules/users/domain/models/ISendForgotPasswordEmail';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';

@injectable()
export class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const newToken = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    if (mailConfig.driver === 'ses') {
      await SESMail.sendMail({
        to: { name: user.name, email: user.email },
        subject: 'Password recovery',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset_password?token=${newToken.token}`,
          },
        },
      });

      return;
    }

    await EtherealMail.sendMail({
      to: { name: user.name, email: user.email },
      subject: 'Password recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${newToken.token}`,
        },
      },
    });
  }
}
