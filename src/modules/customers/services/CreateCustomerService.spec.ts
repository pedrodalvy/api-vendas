import 'reflect-metadata';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService';
import { CustomersHelper } from '@shared/helpers/CustomersHelper';
import { AppError } from '@shared/errors/AppError';

describe('CreateCustomerService', () => {
  describe('When execute method be called', () => {
    const mockRepository = new FakeCustomersRepository();
    const createCustomerService = new CreateCustomerService(mockRepository);

    it('should be able to create a new customer', async () => {
      const customer = await createCustomerService.execute({
        name: 'valid name',
        email: 'valid@email.com',
      });

      expect(customer).toHaveProperty('id');
    });

    it('should not be able to create a two customer with the same email', async () => {
      const mockCustomer = CustomersHelper.giveMeAValidCustomer();
      await mockRepository.create(mockCustomer);

      createCustomerService
        .execute({ name: 'any name', email: mockCustomer.email })
        .catch(error => {
          expect(error).toBeInstanceOf(AppError);
          expect(error.message).toEqual('Email address already used.');
        });
    });
  });
});
