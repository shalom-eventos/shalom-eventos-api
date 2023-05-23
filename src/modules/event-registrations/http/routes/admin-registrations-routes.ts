import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';

import { listRegistrationsByEventController } from '../controllers/list-registrations-by-event-controller';
import { validateRegistrationController } from '../controllers/validate-registration-controller';
import { exportRegistrationsController } from '../controllers/export-registrations-controller';

export async function adminRegistrationsRoutes(app: FastifyInstance) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.get(
    '/registrations/export/event/:event_id',
    adminMiddlewares,
    exportRegistrationsController
  );

  app.get(
    '/registrations/event/:event_id',
    adminMiddlewares,
    listRegistrationsByEventController
  );
  app.patch(
    '/registrations/:registration_id/approve',
    adminMiddlewares,
    validateRegistrationController
  );
}
