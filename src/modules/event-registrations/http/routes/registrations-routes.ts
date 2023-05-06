import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';

import { createRegistrationController } from '../controllers/create-registration-controller';
import { listRegistrationsByEventController } from '../controllers/list-registrations-by-event-controller';
import { listRegistrationsByUserController } from '../controllers/list-registrations-by-user-controller';
import { validateRegistrationController } from '../controllers/validate-registration-controller';

export async function registrationsRoutes(app: FastifyInstance) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
  };

  app.get(
    '/registrations/event/:event_id',
    adminMiddlewares,
    listRegistrationsByEventController
  );
  app.patch(
    '/registrations/:registration_id/validate',
    adminMiddlewares,
    validateRegistrationController
  );

  app.post(
    '/registrations/event/:event_id',
    participantMiddlewares,
    createRegistrationController
  );
  app.get(
    '/registrations/my',
    participantMiddlewares,
    listRegistrationsByUserController
  );
}
