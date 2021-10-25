import { Request, Response } from 'express';
import { ShowProfileService } from '@modules/users/services/ShowProfileService';
import { UpdateProfileService } from '@modules/users/services/UpdateProfileService';
import { classToClass } from 'class-transformer';

export class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const service = new ShowProfileService();
    const user = await service.execute({ userId: request.user.id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;

    const service = new UpdateProfileService();
    const user = await service.execute({
      userId,
      name,
      email,
      password,
      oldPassword,
    });

    return response.json(classToClass(user));
  }
}
