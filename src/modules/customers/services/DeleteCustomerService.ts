import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  customerId: string;
}

export class DeleteCustomerService {
  public async execute({ customerId }: IRequest): Promise<void> {
    const repository = await getCustomRepository(CustomersRepository);
    const customer = await repository.findById(customerId);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    await repository.remove(customer);
  }
}
