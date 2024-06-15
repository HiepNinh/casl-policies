import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.APP_PORT || 3000,
}));
