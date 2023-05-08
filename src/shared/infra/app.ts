import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMulter from 'fastify-multer';
import fastifyStatic from '@fastify/static';

import uploadConfig from '@/config/upload';
import auth from '@/config/auth';
import { appRoutes } from './http/routes';
import { errorHandler } from '../errors/error-handler';

export const app = fastify();

app.register(fastifyJwt, auth.jwt);
app.register(fastifyCookie);
app.register(fastifyMulter.contentParser);

app.register(fastifyStatic, {
  root: uploadConfig.tmpFolder,
  prefix: '/files/',
});

app.register(appRoutes);

app.setErrorHandler(errorHandler);
