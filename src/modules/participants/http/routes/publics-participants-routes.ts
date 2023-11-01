import { FastifyInstance } from 'fastify';

import { registerParticipantingUserController } from '../controllers/register-participanting-user-controller';
import { multer } from '@/shared/lib/multer';

export async function publicsParticipantsRoutes(app: FastifyInstance) {
  const middlewares = {
    preHandler: multer.single('file'),
  };

  app.post(
    '/participants/register',
    middlewares,
    registerParticipantingUserController
  );
}
