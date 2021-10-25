import { User } from '@modules/users/infra/typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { IPagination } from '@shared/interfaces/IPagination';

export class ListUserService {
  public async execute(): Promise<IPagination<User[]>> {
    const repository = getCustomRepository(UsersRepository);

    return await repository.createQueryBuilder().paginate();
  }
}
