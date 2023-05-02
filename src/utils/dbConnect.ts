import { connect } from 'mongoose';
import { DB_HOST, DB_USER, DB_PASS, DB_CLTR, DB_NAME } from '../config/db.config';

export default (): Promise<typeof import('mongoose')> => {
  // Set authSource=admin to authenticate against admin database in mongo server
  const dbConString = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLTR}.${DB_HOST}/${DB_NAME}`;

  return connect(dbConString);
};
