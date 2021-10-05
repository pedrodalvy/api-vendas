import { Request, Response } from 'express';
import { ListProductService } from '@modules/products/services/ListProductService';
import { ShowProductService } from '@modules/products/services/ShowProductService';
import { CreateProductService } from '@modules/products/services/CreateProductService';
import { UpdateProductService } from '@modules/products/services/UpdateProductService';
import { DeleteProductService } from '@modules/products/services/DeleteProductService';

export class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const service = new ListProductService();
    const products = await service.execute();

    return response.json(products);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const service = new ShowProductService();
    const product = await service.execute({ id });

    return response.json(product);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;

    const service = new CreateProductService();
    const product = await service.execute({ name, price, quantity });

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, price, quantity } = request.body;

    const service = new UpdateProductService();
    const product = await service.execute({ id, name, price, quantity });

    return response.json(product);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const service = new DeleteProductService();
    await service.execute({ id });

    return response.status(204);
  }
}
