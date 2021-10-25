import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { getRepository, Repository } from 'typeorm';
import { Order } from '@modules/orders/infra/typeorm/entities/Order';
import { IPagination } from '@shared/interfaces/IPagination';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';

export class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async findById(id: string): Promise<Order | undefined> {
    return await this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });
  }

  public async findAllPaginate(): Promise<IPagination<Order[]>> {
    return await this.ormRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.customer', 'customer')
      .leftJoinAndSelect('orders.order_products', 'order_products')
      .paginate();
  }

  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = await this.ormRepository.create({
      customer,
      order_products: products,
    });

    return await this.ormRepository.save(order);
  }
}
