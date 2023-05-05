import { FastifyInstance } from 'fastify';

import { authenticate } from '../controllers/authenticate';

export async function sessionsRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate);
}
