import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUpdateCustomer } from '@modules/customers/domain/models/IUpdateCustomer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';

@injectable()
export class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IUpdateCustomer): Promise<ICustomer> {
    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && customerExists.id !== id) {
      throw new AppError('There is already one customer with this email.');
    }

    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.');
    }

    customer.email = email;
    customer.name = name;

    return await this.customersRepository.save(customer);
  }
}
