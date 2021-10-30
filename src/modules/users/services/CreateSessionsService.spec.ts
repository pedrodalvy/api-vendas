import 'reflect-metadata';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { IHashProvider } from '@modules/users/providers/HashProvider/models/IHashProvider';
import { CreateSessionsService } from '@modules/users/services/CreateSessionsService';
import { FakeUsersRepository } from '@modules/users/domain/repositories/fakes/FakeUsersRepository';
import { FakeHashProvider } from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import { makeAValidUserMock } from '@shared/helpers/UsersHelper';
import { AppError } from '@shared/errors/AppError';

describe('CreateSessionsService', () => {
  let mockRepository: IUsersRepository;
  let mockHashProvider: IHashProvider;
  let createSessionsService: CreateSessionsService;

  beforeAll(() => {
    process.env.SECRET_EXPIRES = '1d';
    mockRepository = new FakeUsersRepository();
    mockHashProvider = new FakeHashProvider();
    createSessionsService = new CreateSessionsService(
      mockRepository,
      mockHashProvider,
    );
  });

  describe('When execute method be called', () => {
    it('should be able to authenticate', async () => {
      const mockUser = makeAValidUserMock();
      const user = await mockRepository.create(mockUser);

      const response = await createSessionsService.execute({
        email: mockUser.email,
        password: 'valid_password',
      });

      expect(response).toHaveProperty('token');
      expect(typeof response.token).toEqual('string');
      expect(response.user).toMatchObject(user);
    });

    it('should not be able to authenticate whit wrong email', async () => {
      const hashSpy = jest.spyOn(mockHashProvider, 'compareHash');

      const promiseResponse = createSessionsService.execute({
        email: 'wrong@email.com',
        password: 'valid_password',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Incorrect email/password combination.');
      });

      expect(hashSpy).toBeCalledTimes(0);
    });

    it('should not be able to authenticate whit wrong password', async () => {
      const user = await mockRepository.create(makeAValidUserMock());

      const hashSpy = jest.spyOn(mockHashProvider, 'compareHash');
      hashSpy.mockReturnValue(Promise.resolve(false));

      const promiseResponse = createSessionsService.execute({
        email: user.email,
        password: 'wrong_password',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Incorrect email/password combination.');
      });

      expect(hashSpy).toBeCalledTimes(1);
      expect(hashSpy).toBeCalledWith('wrong_password', user.password);
    });
  });
});
