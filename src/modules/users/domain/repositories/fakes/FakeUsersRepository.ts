import { IUser } from '@modules/users/domain/models/IUser';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { v4 as uuidv4 } from 'uuid';
import { IPagination } from '@shared/interfaces/IPagination';
import { makePaginatedResponseMock } from '@shared/helpers/PaginationHelper';

class FakeUser implements IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;

  getAvatarUrl(): string | null {
    return null;
  }
}

export class FakeUsersRepository implements IUsersRepository {
  private readonly users: IUser[] = [];

  public async create({ name, email, password }: ICreateUser): Promise<IUser> {
    const user = new FakeUser();

    user.id = uuidv4();
    user.name = name;
    user.email = email;
    user.password = password;

    this.users.push(user);

    return user;
  }

  public async save(user: IUser): Promise<IUser> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[userIndex] = user;

    return user;
  }

  public async remove(user: IUser): Promise<void> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);
    this.users.splice(userIndex, 1);
  }

  public async findAll(): Promise<IUser[]> {
    return this.users;
  }

  public async findAllPaginate(): Promise<IPagination<IUser[]>> {
    return makePaginatedResponseMock(this.users);
  }

  public async findByName(name: string): Promise<IUser | undefined> {
    return this.users.find(user => user.name === name);
  }

  public async findById(id: string): Promise<IUser | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<IUser | undefined> {
    return this.users.find(user => user.email === email);
  }
}
