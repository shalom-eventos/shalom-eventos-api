import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { listParticipantsController } from '../controllers/list-participants-controller';

export async function adminParticipantsRoutes(app: FastifyInstance) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };
  app.get('/participants/all', adminMiddlewares, listParticipantsController);
}
