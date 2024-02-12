import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';

import { createRegistrationController } from '../controllers/create-registration-controller';
import { listRegistrationsByUserController } from '../controllers/list-registrations-by-user-controller';

export async function participantRegistrationsRoutes(app: FastifyInstance) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
  };

  app.post(
    '/registrations',
    participantMiddlewares,
    createRegistrationController
  );
  app.get(
    '/registrations/my',
    participantMiddlewares,
    listRegistrationsByUserController
  );
}
