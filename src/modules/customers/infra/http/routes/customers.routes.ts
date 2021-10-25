import { Router } from 'express';
import { CustomersController } from '@modules/customers/infra/http/controllers/CustomersController';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '@shared/infra/http/middlewares/isAuthenticated';

const customersRouter = Router();
const customersController = new CustomersController();

customersRouter.use(isAuthenticated);

customersRouter.get('/', customersController.index);

customersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  customersController.create,
);

customersRouter.get(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  customersController.show,
);

customersRouter.put(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: { customerId: Joi.string().uuid().required() },
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  customersController.update,
);

customersRouter.delete(
  '/:customerId',
  celebrate({
    [Segments.PARAMS]: {
      customerId: Joi.string().uuid().required(),
    },
  }),
  customersController.delete,
);

export default customersRouter;
