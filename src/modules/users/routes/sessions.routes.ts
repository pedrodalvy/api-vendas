import { Router } from 'express';
import { SessionsController } from '@modules/users/controllers/SessionsController';
import { celebrate, Joi, Segments } from 'celebrate';

const sessionRouter = Router();
const sessionController = new SessionsController();

sessionRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionController.create,
);

export default sessionRouter;
