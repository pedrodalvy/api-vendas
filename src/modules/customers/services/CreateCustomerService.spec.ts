import 'reflect-metadata';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService';
import { makeAValidCustomerMock } from '@shared/helpers/CustomersHelper';
import { AppError } from '@shared/errors/AppError';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';

describe('CreateCustomerService', () => {
  let mockRepository: ICustomersRepository;
  let createCustomerService: CreateCustomerService;

  beforeEach(() => {
    mockRepository = new FakeCustomersRepository();
    createCustomerService = new CreateCustomerService(mockRepository);
  });

  describe('When execute method be called', () => {
    it('should be able to create a new customer', async () => {
      const customer = await createCustomerService.execute({
        name: 'valid name',
        email: 'valid@email.com',
      });

      expect(customer).toHaveProperty('id');
    });

    it('should not be able to create a two customer with the same email', async () => {
      const mockCustomer = makeAValidCustomerMock();
      await mockRepository.create(mockCustomer);

      const promiseResponse = createCustomerService.execute({
        name: 'any name',
        email: mockCustomer.email,
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Email address already used.');
      });
    });
  });
});
