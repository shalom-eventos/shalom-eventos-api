import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateAddressController } from '../controllers/update-address-controller';
import { createAddressToEventController } from '../controllers/create-address-to-event-controller';
import { getAddressController } from '../controllers/get-address-controller';

export async function addressRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);
  app.addHook('onRequest', verifyUserRole('ADMINISTRATOR'));

  app.post('/addresses/event/:event_id', createAddressToEventController);
  app.get('/addresses/:id', getAddressController);
  app.put('/addresses/:id', updateAddressController);
}
