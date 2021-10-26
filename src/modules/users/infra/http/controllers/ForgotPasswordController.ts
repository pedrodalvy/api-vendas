import { Request, Response } from 'express';
import { SendForgotPasswordEmailService } from '@modules/users/services/SendForgotPasswordEmailService';
import { container } from 'tsyringe';

export class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const service = container.resolve(SendForgotPasswordEmailService);
    await service.execute({ email });

    return response.status(204).send();
  }
}
