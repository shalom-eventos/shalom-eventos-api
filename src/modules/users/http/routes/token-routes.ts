import { FastifyInstance } from 'fastify';

import { refresh } from '../controllers/refresh';

export async function tokenRoutes(app: FastifyInstance) {
  app.patch('/token/refresh', refresh);
}
