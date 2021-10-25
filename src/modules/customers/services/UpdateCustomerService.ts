import { Customer } from '@modules/customers/infra/typeorm/entities/Customer';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  customerId: string;
  name: string;
  email: string;
}

export class UpdateCustomerService {
  public async execute({
    customerId,
    name,
    email,
  }: IRequest): Promise<Customer> {
    const repository = getCustomRepository(CustomersRepository);
    const customerExists = await repository.findByEmail(email);

    if (customerExists && customerExists.email !== email) {
      throw new AppError('There is already one customer with this email.');
    }

    const customer = await repository.findById(customerId);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    customer.email = email;
    customer.name = name;

    return await repository.save(customer);
  }
}
