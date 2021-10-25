import { IPagination } from '@shared/interfaces/IPagination';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';

@injectable()
export class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IPagination<ICustomer[]>> {
    return await this.customersRepository.findAllPaginate();
  }
}
