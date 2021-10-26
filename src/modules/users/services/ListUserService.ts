import { inject, injectable } from 'tsyringe';
import { IPagination } from '@shared/interfaces/IPagination';
import { IUser } from '@modules/users/domain/models/IUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';

@injectable()
export class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IPagination<IUser[]>> {
    return await this.usersRepository.findAllPaginate();
  }
}
