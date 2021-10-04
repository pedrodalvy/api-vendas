import { Product } from '@modules/products/typeorm/entities/Product';
import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';

export class ListProductService {
  public async execute(): Promise<Product[]> {
    const repository = getCustomRepository(ProductsRepository);

    return await repository.find();
  }
}
