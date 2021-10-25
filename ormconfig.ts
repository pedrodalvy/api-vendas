import * as dotenv from 'dotenv';
import { env } from 'node:process';

dotenv.config();

export default {
  type: env.DB_CONNECTION,
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  migrations: ['./dist/shared/typeorm/migrations/*.js'],
  entities: ['./dist/modules/**/typeorm/entities/*.js'],
  cli: {
    migrationsDir: './src/shared/typeorm/migrations',
  },
};
