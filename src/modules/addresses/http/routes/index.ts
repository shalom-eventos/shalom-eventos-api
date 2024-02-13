import { FastifyInstance } from 'fastify';

import { eventAddressesRoutes } from './event-addresses-routes';
import { userAddressesRoutes } from './user-addresses-routes';

export async function addressesRoutes(app: FastifyInstance) {
  app.register(eventAddressesRoutes);
  app.register(userAddressesRoutes);
}
