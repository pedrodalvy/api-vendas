import { Product } from '@modules/products/typeorm/entities/Product';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import { IPagination } from '@shared/interfaces/IPagination';
import redisCache from '@shared/cache/RedisCache';

export class ListProductService {
  public async execute(): Promise<IPagination<Product[]>> {
    const repository = getCustomRepository(ProductsRepository);

    const cacheKey = 'api-vendas-PRODUCT-LIST';
    let products = await redisCache.recover<IPagination<Product[]>>(cacheKey);

    if (!products) {
      products = await repository.createQueryBuilder().paginate();
      await redisCache.save(cacheKey, products);
    }

    return products;
  }
}
