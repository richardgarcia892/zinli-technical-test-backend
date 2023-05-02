import env from './env.config';

export const FE_HOST = 'localhost';
export const FE_PROTOCOL = 'http';
export const FE_PORT = 4200;
export const FE_URL = env.FE_URL ? env.FE_URL : `${FE_PROTOCOL}://${FE_HOST}:${FE_PORT}`;

export const FE_ACCOUNT_VERIFICATION_ROUTE = 'auth/signup';
export const FE_PASSWORD_RECOVERY_ROUTE = 'auth/resetpassword';
