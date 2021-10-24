import { Request, Response } from 'express';
import { ShowOrderService } from '@modules/orders/services/ShowOrderService';
import { CreateOrderService } from '@modules/orders/services/CreateOrderService';

export class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const service = new ShowOrderService();
    const order = await service.execute({ id });

    return response.json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const service = new CreateOrderService();
    const order = await service.execute({ customer_id, products });

    return response.json(order);
  }
}
