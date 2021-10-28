import 'reflect-metadata';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { CreateUserService } from '@modules/users/services/CreateUserService';
import { FakeUsersRepository } from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';
import { FakeHashProvider } from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import { AppError } from '@shared/errors/AppError';
import { makeAValidUserMock } from '@shared/helpers/UsersHelper';

describe('CreateUserService', () => {
  let mockRepository: IUsersRepository;
  let mockHashProvider: IHashProvider;
  let createUserService: CreateUserService;

  beforeAll(() => {
    mockRepository = new FakeUsersRepository();
    mockHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(mockRepository, mockHashProvider);
  });

  describe('When execute method be called', () => {
    it('should be able to create a new user', async () => {
      const user = await createUserService.execute({
        name: 'valid name',
        email: 'valid@email.com',
        password: 'valid password',
      });

      expect(user).toHaveProperty('id');
    });

    it('should not be able to create a two users with the same email', async () => {
      const mockUser = makeAValidUserMock();
      await mockRepository.create(mockUser);

      const promiseResponse = createUserService.execute({
        name: 'any name',
        email: mockUser.email,
        password: 'any_password',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Email address already used.');
      });
    });
  });
});
