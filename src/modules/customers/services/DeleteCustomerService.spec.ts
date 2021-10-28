import 'reflect-metadata';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { DeleteCustomerService } from '@modules/customers/services/DeleteCustomerService';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { makeAValidCustomerMock } from '@shared/helpers/CustomersHelper';
import { AppError } from '@shared/errors/AppError';

describe('DeleteCustomerService', () => {
  let mockRepository: ICustomersRepository;
  let deleteCustomerService: DeleteCustomerService;

  beforeEach(() => {
    mockRepository = new FakeCustomersRepository();
    deleteCustomerService = new DeleteCustomerService(mockRepository);
  });

  describe('When execute method be called', () => {
    it('should remove a customer', async () => {
      const mockCustomer = makeAValidCustomerMock();
      const customer = await mockRepository.create(mockCustomer);

      await deleteCustomerService.execute({ id: customer.id });

      const emptyResponse = await mockRepository.findById(customer.id);
      expect(emptyResponse).toBeFalsy();
    });

    it('should throws on not found searched customer', async () => {
      const promiseResponse = deleteCustomerService.execute({
        id: 'nonexistent_id',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Customer not found.');
      });
    });
  });
});
