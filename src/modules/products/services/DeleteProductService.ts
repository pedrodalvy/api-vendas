import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import { Product } from '@modules/products/infra/typeorm/entities/Product';
import { AppError } from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

export class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const repository = getCustomRepository(ProductsRepository);

    const product = await repository.findOne(id);

    if (!(product instanceof Product)) {
      throw new AppError('Product not found.');
    }

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    await repository.remove(product);
  }
}
