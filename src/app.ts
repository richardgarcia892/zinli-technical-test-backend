import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routerApi from './routes';
import { IUser } from './models/user.model';
import { AppErrorHandler, InternalErrorHandler } from './controllers/error.controller';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

routerApi(app);

app.use(AppErrorHandler);
app.use(InternalErrorHandler);

export default app;
