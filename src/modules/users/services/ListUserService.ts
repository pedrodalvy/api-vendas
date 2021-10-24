import { User } from '@modules/users/typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/typeorm/repositories/UsersRepository';
import { IPagination } from '@shared/interfaces/IPagination';

export class ListUserService {
  public async execute(): Promise<IPagination<User[]>> {
    const repository = getCustomRepository(UsersRepository);

    return await repository.createQueryBuilder().paginate();
  }
}
