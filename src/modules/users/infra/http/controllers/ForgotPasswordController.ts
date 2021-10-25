import { Request, Response } from 'express';
import { SendForgotPasswordEmailService } from '@modules/users/services/SendForgotPasswordEmailService';

export class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const service = new SendForgotPasswordEmailService();
    await service.execute({ email });

    return response.status(204).send();
  }
}
