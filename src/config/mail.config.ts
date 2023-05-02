import env from './env.config';

const EMAIL_USERNAME: string = env.EMAIL_USERNAME ? env.EMAIL_USERNAME : '';
const EMAIL_PASSWORD: string = env.EMAIL_PASSWORD ? env.EMAIL_PASSWORD : '';
const EMAIL_HOST: string = env.EMAIL_HOST ? env.EMAIL_HOST : '';
const EMAIL_PORT: string = env.EMAIL_PORT ? env.EMAIL_PORT : '';

// Check if any ENV variable is not set
if ([EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT].some((value) => !value))
  throw new Error(`one or more ENV variables related to Database connection are undefined`);

export { EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT };
