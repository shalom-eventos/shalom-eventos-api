import { FastifyInstance } from 'fastify';

import { adminParticipantsRoutes } from './admin-participants-routes';
import { userParticipantsRoutes } from './user-participants-routes';
import { publicsParticipantsRoutes } from './publics-participants-routes';

export async function participantsRoutes(app: FastifyInstance) {
  app.register(publicsParticipantsRoutes);
  app.register(adminParticipantsRoutes);
  app.register(userParticipantsRoutes);
}
