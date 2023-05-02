import env from './env.config';

const app_port = env.APP_PORT;

if (!app_port) throw new Error('ENV variable APP_PORT unset');

export { app_port };
