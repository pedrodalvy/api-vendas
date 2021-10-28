import 'reflect-metadata';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { UpdateCustomerService } from '@modules/customers/services/UpdateCustomerService';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { makeAValidCustomerMock } from '@shared/helpers/CustomersHelper';
import { AppError } from '@shared/errors/AppError';

describe('UpdateCustomerService', () => {
  let mockRepository: ICustomersRepository;
  let updateCustomerService: UpdateCustomerService;

  beforeEach(() => {
    mockRepository = new FakeCustomersRepository();
    updateCustomerService = new UpdateCustomerService(mockRepository);
  });

  describe('When execute method be called', () => {
    it('should update a customer', async () => {
      const mockCustomer = makeAValidCustomerMock();
      const customer = await mockRepository.create(mockCustomer);

      const updatedCustomer = await updateCustomerService.execute({
        id: customer.id,
        name: 'Updated Name',
        email: 'updated@email.com',
      });

      expect(updatedCustomer).toMatchObject({
        id: customer.id,
        name: 'Updated Name',
        email: 'updated@email.com',
      });
    });

    it('should not update a customer with the same email of another customer', async () => {
      await mockRepository.create({ name: 'First', email: 'first@email.com' });
      const mockCustomer = makeAValidCustomerMock();
      const customer = await mockRepository.create(mockCustomer);

      const promiseResponse = updateCustomerService.execute({
        id: customer.id,
        name: 'Any Name',
        email: 'first@email.com',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual(
          'There is already one customer with this email.',
        );
      });
    });

    it('should throws on not found searched customer', async () => {
      const promiseResponse = updateCustomerService.execute({
        id: 'nonexistent_id',
        name: 'Any Name',
        email: 'any@email.com',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Customer not found.');
      });
    });
  });
});
