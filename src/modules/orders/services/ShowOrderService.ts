import { Order } from '@modules/orders/typeorm/entities/Order';
import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '@modules/orders/typeorm/repositories/OrdersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

export class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {
    const repository = getCustomRepository(OrdersRepository);

    const order = await repository.findById(id);
    if (!order) {
      throw new AppError('Order not found.');
    }

    return order;
  }
}
