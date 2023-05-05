import { FastifyInstance } from 'fastify';

import { profile } from '../controllers/profile';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', profile);
}
