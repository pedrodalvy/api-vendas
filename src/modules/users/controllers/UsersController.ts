import { Request, Response } from 'express';
import { ListUserService } from '@modules/users/services/ListUserService';
import { CreateUserService } from '@modules/users/services/CreateUserService';
import { classToClass } from 'class-transformer';

export class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const service = new ListUserService();
    const users = await service.execute();

    return response.json(classToClass(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const service = new CreateUserService();
    const user = await service.execute({ name, email, password });

    return response.json(classToClass(user));
  }
}
