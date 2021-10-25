import { Order } from '@modules/orders/typeorm/entities/Order';
import { getCustomRepository } from 'typeorm';
import { OrdersRepository } from '@modules/orders/typeorm/repositories/OrdersRepository';
import { CustomersRepository } from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ProductsRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import { AppError } from '@shared/errors/AppError';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

export class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);

    const customerExists = await customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id.');
    }

    const existsProducts = await productsRepository.findAllByIds(products);
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

    const order = await ordersRepository.createOrder({
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

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}
