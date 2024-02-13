import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateAddressToUserController } from '../controllers/update-address-to-user-controller';
import { listAddressesByUserController } from '../controllers/list-addresses-by-user-controller';
import { createAddressToUserController } from '../controllers/create-address-to-user-controller';

export async function userAddressesRoutes(app: FastifyInstance) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
  };

  app.post(
    '/addresses/user',
    participantMiddlewares,
    createAddressToUserController
  );
  app.put(
    '/addresses/:id/user',
    participantMiddlewares,
    updateAddressToUserController
  );
  app.get(
    '/addresses/user',
    participantMiddlewares,
    listAddressesByUserController
  );
}
