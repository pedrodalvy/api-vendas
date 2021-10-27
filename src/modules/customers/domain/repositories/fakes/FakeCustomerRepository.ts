import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IPagination } from '@shared/interfaces/IPagination';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { v4 as uuidv4 } from 'uuid';

export class FakeCustomersRepository implements ICustomersRepository {
  private readonly customers: ICustomer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer: ICustomer = {
      id: uuidv4(),
      name: name,
      email: email,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: ICustomer): Promise<ICustomer> {
    const customerIndex = this.customers.findIndex(
      findCustomer => findCustomer.id === customer.id,
    );

    this.customers[customerIndex] = customer;

    return customer;
  }

  public async findByName(name: string): Promise<ICustomer | undefined> {
    return this.customers.find(customer => customer.name === name);
  }

  public async findById(id: string): Promise<ICustomer | undefined> {
    return this.customers.find(customer => customer.id === id);
  }

  public async findByEmail(email: string): Promise<ICustomer | undefined> {
    return this.customers.find(customer => customer.email === email);
  }

  public async findAll(): Promise<ICustomer[] | undefined> {
    throw new Error('Method not implemented.');
  }

  public async findAllPaginate(): Promise<IPagination<ICustomer[]>> {
    throw new Error('Method not implemented.');
  }

  public async remove(customer: ICustomer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
