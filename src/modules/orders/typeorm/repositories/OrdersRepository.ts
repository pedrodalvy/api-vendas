import { EntityRepository, Repository } from 'typeorm';
import { Order } from '@modules/orders/typeorm/entities/Order';
import { Customer } from '@modules/customers/typeorm/entities/Customer';

interface IProducts {
  product_id: string;
  price: number;
  quantity: number;
}

interface ICreateOrder {
  customer: Customer;
  products: IProducts[];
}

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    return this.findOne(id, {
      relations: ['order_products', 'customer'],
    });
  }

  public async createOrder({
    customer,
    products,
  }: ICreateOrder): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    });

    await this.save(order);

    return order;
  }
}
