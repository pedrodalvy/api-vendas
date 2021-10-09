import { EntityRepository, Repository } from 'typeorm';
import { UserToken } from '@modules/users/typeorm/entities/UserToken';

@EntityRepository(UserToken)
export class UserTokensRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.findOne({ where: { token } });
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = await this.create({ user_id });

    return this.save(userToken);
  }
}
