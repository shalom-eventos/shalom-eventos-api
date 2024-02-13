import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';

import { listRegistrationsByEventController } from '../controllers/list-registrations-by-event-controller';
import { validateRegistrationController } from '../controllers/validate-registration-controller';
import { exportRegistrationsController } from '../controllers/export-registrations-controller';
import { deleteRegistrationController } from '../controllers/delete-registration-controller';

export async function adminRegistrationsRoutes(app: FastifyInstance) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.get(
    '/registrations/export',
    adminMiddlewares,
    exportRegistrationsController
  );

  app.get(
    '/registrations',
    adminMiddlewares,
    listRegistrationsByEventController
  );
  app.patch(
    '/registrations/:registrationId/approve',
    adminMiddlewares,
    validateRegistrationController
  );
  app.delete(
    '/registrations/:registrationId',
    adminMiddlewares,
    deleteRegistrationController
  );
}
