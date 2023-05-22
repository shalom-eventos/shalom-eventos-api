import { FastifyInstance } from 'fastify';

import { eventAddressesRoutes } from './event-addresses-routes';
import { participantAddressesRoutes } from './participant-addresses-routes';

export async function addressesRoutes(app: FastifyInstance) {
  app.register(eventAddressesRoutes);
  app.register(participantAddressesRoutes);
}
