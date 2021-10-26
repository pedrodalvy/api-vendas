import { Request, Response } from 'express';
import { ShowProfileService } from '@modules/users/services/ShowProfileService';
import { UpdateProfileService } from '@modules/users/services/UpdateProfileService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

export class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(ShowProfileService);
    const user = await service.execute({ id: request.user.id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password, oldPassword } = request.body;

    const service = container.resolve(UpdateProfileService);
    const user = await service.execute({
      id,
      name,
      email,
      password,
      oldPassword,
    });

    return response.json(classToClass(user));
  }
}
