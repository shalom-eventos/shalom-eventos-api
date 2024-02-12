import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateAddressToEventController } from '../controllers/update-address-to-event-controller';
import { createAddressToEventController } from '../controllers/create-address-to-event-controller';
import { getAddressController } from '../controllers/get-address-controller';
import { listAddressesByEventController } from '../controllers/list-addresses-by-event-controller';

export async function eventAddressesRoutes(app: FastifyInstance) {
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.get('/addresses/:id', adminMiddlewares, getAddressController);

  app.post(
    '/addresses/event',
    adminMiddlewares,
    createAddressToEventController
  );
  app.put(
    '/addresses/:addressId/event/:eventId',
    adminMiddlewares,
    updateAddressToEventController
  );
  app.get(
    '/addresses/event/:eventId',
    adminMiddlewares,
    listAddressesByEventController
  );
}
