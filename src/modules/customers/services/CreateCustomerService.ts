import { Customer } from '@modules/customers/typeorm/entities/Customer';
import { getCustomRepository } from 'typeorm';
import { CustomersRepository } from '@modules/customers/typeorm/repositories/CustomersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  name: string;
  email: string;
}

export class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const repository = getCustomRepository(CustomersRepository);

    const emailExists = await repository.findByEmail(email);
    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const customer = repository.create({ name, email });
    return await repository.save(customer);
  }
}
