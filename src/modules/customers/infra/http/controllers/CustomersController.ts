import { Request, Response } from 'express';
import { ListCustomerService } from '@modules/customers/services/ListCustomerService';
import { CreateCustomerService } from '@modules/customers/services/CreateCustomerService';
import { ShowCustomerService } from '@modules/customers/services/ShowCustomerService';
import { UpdateCustomerService } from '@modules/customers/services/UpdateCustomerService';
import { DeleteCustomerService } from '@modules/customers/services/DeleteCustomerService';

export class CustomersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const service = new ListCustomerService();

    const customers = await service.execute();

    return response.json(customers);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;
    const service = new CreateCustomerService();

    const customer = await service.execute({ name, email });

    return response.json(customer);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.params;
    const service = new ShowCustomerService();

    const customer = await service.execute({ customerId });

    return response.json(customer);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.params;
    const { name, email } = request.body;
    const service = new UpdateCustomerService();

    const customer = await service.execute({ customerId, name, email });

    return response.json(customer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { customerId } = request.params;
    const service = new DeleteCustomerService();

    await service.execute({ customerId });

    return response.status(204).send();
  }
}
