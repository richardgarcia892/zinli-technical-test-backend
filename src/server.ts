import app from './app';
import dbConnect from './utils/dbConnect';
import { app_port } from './config/app.config';

dbConnect()
  .then(() => {
    console.log('DB connection success');
    app.listen(app_port, () => console.log(`port ${app_port} available, server running`));
  })
  .catch((err: Error) => {
    console.error(`Failed to connect to MongoDB: ${err}`);
  });
