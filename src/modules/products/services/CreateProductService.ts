import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import { AppError } from '@shared/errors/AppError';
import { Product } from '@modules/products/infra/typeorm/entities/Product';
import redisCache from '@shared/cache/RedisCache';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

export class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const repository = getCustomRepository(ProductsRepository);
    const productExists = await repository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name.');
    }

    const product = repository.create({ name, price, quantity });
    await repository.save(product);

    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    return product;
  }
}
