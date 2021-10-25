import { Customer } from '@modules/customers/infra/typeorm/entities/Customer';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  customerId: string;
}

export class ShowCustomerService {
  public async execute({ customerId }: IRequest): Promise<Customer> {
    const repository = getCustomRepository(CustomersRepository);
    const customer = await repository.findById(customerId);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    return customer;
  }
}
