import { env } from 'node:process';

interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export const mailConfig = {
  driver: env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: env.MAIL_FROM,
      name: env.MAIL_NAME,
    },
  },
} as IMailConfig;
