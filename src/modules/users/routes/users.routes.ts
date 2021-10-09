import { Router } from 'express';
import { UsersController } from '@modules/users/controllers/UsersController';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '@shared/http/middlewares/isAuthenticated';
import { UserAvatarController } from '@modules/users/controllers/UserAvatarController';
import multer from 'multer';
import { uploadConfig } from '@config/upload';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.get('/', isAuthenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;
