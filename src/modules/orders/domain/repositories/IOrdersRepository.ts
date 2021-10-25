import { IOrder } from '@modules/orders/domain/models/IOrder';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IPagination } from '@shared/interfaces/IPagination';

export interface IOrdersRepository {
  findById(id: string): Promise<IOrder | undefined>;

  findAllPaginate(): Promise<IPagination<IOrder[]>>;

  create(data: ICreateOrder): Promise<IOrder>;
}
