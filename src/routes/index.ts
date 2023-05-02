import { Application, Router } from 'express';
import userRouter from './user.router';
import authRouter from './auth.router';

export default (app: Application): void => {
  const router: Router = Router();
  app.use('/api/v1', router);
  router.use('/auth', authRouter);
  router.use('/users', userRouter);
};
