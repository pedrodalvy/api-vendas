import { User } from '@modules/users/typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';

export class ListUserService {
  public async execute(): Promise<User[]> {
    const repository = getCustomRepository(UsersRepository);

    return await repository.find();
  }
}
