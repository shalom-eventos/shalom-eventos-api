import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMulter from 'fastify-multer';
import fastifyStatic from '@fastify/static';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import cors from '@fastify/cors';
import '../container';

import uploadConfig from '@/config/upload';
import auth from '@/config/auth';
import { appRoutes } from './http/routes';
import { errorHandler } from '../errors/error-handler';

export const app = fastify();

app.register(fastifyJwt, auth.jwt);
app.register(fastifyCookie);
app.register(fastifyMulter.contentParser);
app.register(cors, {
  // Permitir origens específicas (ou use "*" para permitir qualquer origem)
  origin: '*',
  // Permitir métodos HTTP específicos
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  // Permitir cabeçalhos HTTP personalizados
  allowedHeaders: ['Authorization', 'Content-Type'],
  // Permitir o envio de credenciais (cookies)
  credentials: true,
});
app.register(fastifyAwilixPlugin, {
  disposeOnClose: true,
  disposeOnResponse: true,
});
app.register(fastifyStatic, {
  root: uploadConfig.tmpFolder,
  prefix: '/files/',
});

app.register(appRoutes);

app.setErrorHandler(errorHandler);
