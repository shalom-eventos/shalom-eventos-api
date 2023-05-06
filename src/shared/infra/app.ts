import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastifyMulter from 'fastify-multer';
import fastifyStatic from '@fastify/static';

import uploadConfig from '@/config/upload';
const upload = fastifyMulter(uploadConfig.multer);

import { appRoutes } from './http/routes';
import { errorHandler } from '../errors/error-handler';
import auth from '@/config/auth';

export const app = fastify();

app.register(fastifyJwt, auth.jwt);
app.register(fastifyCookie);
app.register(fastifyMulter.contentParser);

app.register(fastifyStatic, {
  root: uploadConfig.tmpFolder,
  prefix: '/files/',
});

app.post(
  '/file',
  { preHandler: upload.single('avatar') },
  function (request, reply) {
    // request.file is the `avatar` file
    // request.body will hold the text fields, if there were any
    reply.code(200).send('SUCCESS');
  }
);

app.register(appRoutes);

app.setErrorHandler(errorHandler);
