import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateAddressToEventController } from '../controllers/update-address-to-event-controller';
import { createAddressToEventController } from '../controllers/create-address-to-event-controller';
import { getAddressController } from '../controllers/get-address-controller';
import { listAddressesByEventController } from '../controllers/list-addresses-by-event-controller';

export async function eventAddressesRoutes(app: FastifyInstance) {
  app.get('/addresses/:id', getAddressController);

  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post(
    '/addresses/event/:event_id',
    adminMiddlewares,
    createAddressToEventController
  );
  app.put(
    '/addresses/:address_id/event/:event_id',
    adminMiddlewares,
    updateAddressToEventController
  );
  app.get(
    '/addresses/event/:event_id',
    adminMiddlewares,
    listAddressesByEventController
  );
}
