import { EntityRepository, Repository } from 'typeorm';
import { User } from '@modules/users/infra/typeorm/entities/User';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  public async findByName(name: string): Promise<User | undefined> {
    return this.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ where: { email } });
  }
}
