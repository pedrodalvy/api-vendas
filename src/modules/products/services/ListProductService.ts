import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IPagination } from '@shared/interfaces/IPagination';
import { IProduct } from '@modules/products/domain/models/IProduct';

@injectable()
export class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<IPagination<IProduct[]>> {
    const cacheKey = 'api-vendas-PRODUCT-LIST';
    let products = await redisCache.recover<IPagination<IProduct[]>>(cacheKey);

    if (!products) {
      products = await this.productsRepository.findAllPaginate();
      await redisCache.save(cacheKey, products);
    }

    return products;
  }
}
