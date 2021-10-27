import 'reflect-metadata';
import { makeAValidUserMock } from '@shared/helpers/CustomersHelper';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ShowCustomerService } from '@modules/customers/services/ShowCustomerService';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { AppError } from '@shared/errors/AppError';

describe('ShowCustomerService', () => {
  let mockRepository: ICustomersRepository;
  let showCustomerService: ShowCustomerService;

  beforeEach(() => {
    mockRepository = new FakeCustomersRepository();
    showCustomerService = new ShowCustomerService(mockRepository);
  });

  describe('When execute method be called', () => {
    it('should show the searched customer', async () => {
      const mockCustomer = makeAValidUserMock();
      const expectedCustomer = await mockRepository.create(mockCustomer);

      const customer = await showCustomerService.execute({
        id: expectedCustomer.id,
      });

      expect(customer).toMatchObject(expectedCustomer);
    });

    it('should throws on not found searched customer', async () => {
      const promiseResponse = showCustomerService.execute({
        id: 'nonexistent_id',
      });

      await expect(promiseResponse).rejects.toBeInstanceOf(AppError);
      promiseResponse.catch(error => {
        expect(error.message).toEqual('Customer not found.');
      });
    });
  });
});
