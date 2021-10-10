import { Customer } from '@modules/customers/typeorm/entities/Customer';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';

export class ListCustomerService {
  public async execute(): Promise<Customer[]> {
    const repository = getCustomRepository(CustomersRepository);

    return await repository.find();
  }
}
