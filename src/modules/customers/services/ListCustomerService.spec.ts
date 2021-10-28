import 'reflect-metadata';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ListCustomerService } from '@modules/customers/services/ListCustomerService';
import { FakeCustomersRepository } from '@modules/customers/domain/repositories/fakes/FakeCustomerRepository';
import { makeAValidCustomerMock } from '@shared/helpers/CustomersHelper';
import { makePaginatedResponseMock } from '@shared/helpers/PaginationHelper';

describe('ListCustomerService', () => {
  let mockRepository: ICustomersRepository;
  let listCustomerService: ListCustomerService;

  beforeEach(() => {
    mockRepository = new FakeCustomersRepository();
    listCustomerService = new ListCustomerService(mockRepository);
  });

  describe('When execute method be called', () => {
    it('should list many customers', async () => {
      const mockCustomer = makeAValidCustomerMock();
      const customers = [
        await mockRepository.create(mockCustomer),
        await mockRepository.create(mockCustomer),
        await mockRepository.create(mockCustomer),
      ];

      const customerPaginated = await listCustomerService.execute();

      expect(customerPaginated).toEqual(makePaginatedResponseMock(customers));
    });

    it('should not list customers', async () => {
      const customerPaginated = await listCustomerService.execute();
      expect(customerPaginated).toEqual(makePaginatedResponseMock([]));
    });
  });
});
