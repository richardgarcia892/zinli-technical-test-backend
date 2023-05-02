import env from './env.config';

interface JwtPayloadI {
  id: string;
  iat: number;
  exp: number;
}

const JWT_SECRET: string = env.JWT_SECRET ? env.JWT_SECRET : '';
const JWT_EXPIRES_IN: number = 90 * 24 * 60 * 60 * 1000; // 90 DAYS
const JWT_COOKIE_EXPIRES_IN = 90;

// Check if any ENV variable is not set
if ([JWT_SECRET].some((value) => !value))
  throw new Error(`one or more ENV variables related to Database connection are undefined`);

export { JwtPayloadI, JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN };
