import { FastifyInstance } from 'fastify';

import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { profile } from '../controllers/profile';

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', { onRequest: [verifyJWT] }, profile);
}
