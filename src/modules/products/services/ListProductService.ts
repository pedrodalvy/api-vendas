import { Product } from '@modules/products/typeorm/entities/Product';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import { IPagination } from '@shared/interfaces/IPagination';

export class ListProductService {
  public async execute(): Promise<IPagination<Product[]>> {
    const repository = getCustomRepository(ProductsRepository);

    return await repository.createQueryBuilder().paginate();
  }
}
