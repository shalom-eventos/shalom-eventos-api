import { FastifyInstance } from 'fastify';

import { adminRegistrationsRoutes } from './admin-registrations-routes';
import { participantRegistrationsRoutes } from './participant-registrations-routes';

export async function registrationsRoutes(app: FastifyInstance) {
  app.register(adminRegistrationsRoutes);
  app.register(participantRegistrationsRoutes);
}
