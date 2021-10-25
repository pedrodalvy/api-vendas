import { Request, Response } from 'express';
import { ListCustomerService } from '@modules/customers/services/ListCustomerService';
import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService';
import { ShowCustomerService } from '@modules/customers/services/ShowCustomerService';
import { UpdateCustomerService } from '@modules/customers/services/UpdateCustomerService';
import { DeleteCustomerService } from '@modules/customers/services/DeleteCustomerService';
import { container } from 'tsyringe';

export class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ListCustomerService);
    const customers = await service.execute();

    return response.json(customers);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const service = container.resolve(CreateCustomerService);
    const customer = await service.execute({ name, email });

    return response.json(customer);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const service = container.resolve(ShowCustomerService);
    const customer = await service.execute({ id });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;
    const service = container.resolve(UpdateCustomerService);
    const customer = await service.execute({ id, name, email });

    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const service = container.resolve(DeleteCustomerService);

    await service.execute({ id });

    return response.status(204).send();
  }
}
