import { Request, Response } from 'express';
import { CreateSessionsService } from '@modules/users/services/CreateSessionsService';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

export class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(CreateSessionsService);
    const { user, token } = await service.execute({ email, password });

    return response.json({ user: classToClass(user), token });
  }
}
