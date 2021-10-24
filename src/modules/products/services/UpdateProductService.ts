import { Product } from '@modules/products/typeorm/entities/Product';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import { AppError } from '@shared/errors/AppError';
import { RedisCache } from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const repository = getCustomRepository(ProductsRepository);

    const product = await repository.findOne(id);

    if (!(product instanceof Product)) {
      throw new AppError('Product not found.');
    }

    const productExists = await repository.findByName(name);

    if (productExists && productExists.id !== id) {
      throw new AppError('There is already one product with this name.');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await repository.save(product);

    const redisCache = new RedisCache();
    await redisCache.invalidate('api-vendas-PRODUCT-LIST');

    return product;
  }
}
