import { getRepository, Repository } from 'typeorm';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IPagination } from '@shared/interfaces/IPagination';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });
    return await this.ormRepository.save(user);
  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }

  public async findAll(): Promise<User[]> {
    return await this.ormRepository.find();
  }

  public async findAllPaginate(): Promise<IPagination<User[]>> {
    return await this.ormRepository
      .createQueryBuilder()
      .orderBy('User.name', 'ASC')
      .paginate();
  }

  public async findByName(name: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({ where: { email } });
  }
}
