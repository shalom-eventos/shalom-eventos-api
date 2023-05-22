import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { updateAddressToParticipantController } from '../controllers/update-address-to-participant-controller';
import { listAddressesByParticipantController } from '../controllers/list-addresses-by-participant-controller';
import { createAddressToParticipantController } from '../controllers/create-address-to-participant-controller';

export async function participantAddressesRoutes(app: FastifyInstance) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
  };

  app.post(
    '/addresses/participant',
    participantMiddlewares,
    createAddressToParticipantController
  );
  app.put(
    '/addresses/:id/participant',
    participantMiddlewares,
    updateAddressToParticipantController
  );
  app.get(
    '/addresses/participant',
    participantMiddlewares,
    listAddressesByParticipantController
  );
}
