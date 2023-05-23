import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateParticipantController } from '../controllers/update-participant-controller';
import { createParticipantController } from '../controllers/create-participant-controller';
import { showParticipantController } from '../controllers/show-participants-controller';

export async function userParticipantsRoutes(app: FastifyInstance) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
  };

  app.post(
    '/participants/me',
    participantMiddlewares,
    createParticipantController
  );
  app.get(
    '/participants/me',
    participantMiddlewares,
    showParticipantController
  );
  app.put(
    '/participants/me',
    participantMiddlewares,
    updateParticipantController
  );
}
