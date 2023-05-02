import env from './env.config';

const { DB_HOST, DB_USER, DB_PASS, DB_CLTR, DB_NAME } = env;

// Check if any ENV variable is not set

if ([DB_HOST, DB_USER, DB_PASS, DB_CLTR, DB_NAME].some((value) => !value))
  throw new Error(`one or more ENV variables related to Database connection are undefined`);

export { DB_HOST, DB_USER, DB_PASS, DB_CLTR, DB_NAME };
