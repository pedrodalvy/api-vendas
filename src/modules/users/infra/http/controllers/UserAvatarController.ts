import { Request, Response } from 'express';
import { UpdateUserAvatarService } from '@modules/users/services/UpdateUserAvatarService';
import { classToClass } from 'class-transformer';

export class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const service = new UpdateUserAvatarService();

    const user = await service.execute({
      userId: request.user.id,
      avatarFileName: String(request.file?.filename),
    });

    return response.json(classToClass(user));
  }
}
