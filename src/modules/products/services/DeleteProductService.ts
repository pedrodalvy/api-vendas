import { getCustomRepository } from 'typeorm';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import { Product } from '@modules/products/typeorm/entities/Product';
import { AppError } from '@shared/errors/AppError';

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

    await repository.remove(product);
  }
}
