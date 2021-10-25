import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { getRepository, In, Repository } from 'typeorm';
import { Product } from '@modules/products/infra/typeorm/entities/Product';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IPagination } from '@shared/interfaces/IPagination';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';

export class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<Product> {
    const product = await this.ormRepository.create({ name, price, quantity });

    return await this.ormRepository.save(product);
  }

  public async save(product: Product): Promise<Product> {
    return await this.ormRepository.save(product);
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<Product | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findAll(): Promise<Product[]> {
    return this.ormRepository.find();
  }

  public async findAllPaginate(): Promise<IPagination<Product[]>> {
    return await this.ormRepository.createQueryBuilder().paginate();
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    return await this.ormRepository.find({ where: { id: In(productIds) } });
  }
}
