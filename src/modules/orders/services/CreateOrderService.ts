import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IOrder } from '@modules/orders/domain/models/IOrder';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IRequestCreateOrder } from '@modules/orders/domain/models/IRequestCreateOrder';

@injectable()
export class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await this.productsRepository.findAllByIds(products);
    if (!existsProducts.length) {
      throw new AppError('Could not find any customer with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkNonexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkNonexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkNonexistentProducts.shift()?.id}.`,
      );
    }

    const quantityAvailable = products.filter(
      inputProduct =>
        existsProducts.filter(product => product.id === inputProduct.id)[0]
          ?.quantity < inputProduct.quantity,
    );

    if (quantityAvailable.length) {
      const receivedQuantity = quantityAvailable.shift()?.quantity;
      const receivedId = quantityAvailable.shift()?.id;

      throw new AppError(
        `The quantity ${receivedQuantity} is not available for ${receivedId}.`,
      );
    }

    const serializedProducts = products.map(inputProduct => ({
      product_id: inputProduct.id,
      quantity: inputProduct.quantity,
      price: <number>(
        existsProducts.filter(product => product.id === inputProduct.id).shift()
          ?.price
      ),
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;
    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        <number>(
          existsProducts
            .filter(existProduct => existProduct.id === product.product_id)
            .shift()?.quantity
        ) - product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}
