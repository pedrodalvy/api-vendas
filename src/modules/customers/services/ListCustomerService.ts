import { Customer } from '@modules/customers/infra/typeorm/entities/Customer';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { IPagination } from '@shared/interfaces/IPagination';

export class ListCustomerService {
  public async execute(): Promise<IPagination<Customer[]>> {
    const repository = getCustomRepository(CustomersRepository);

    return await repository.createQueryBuilder().paginate();
  }
}
