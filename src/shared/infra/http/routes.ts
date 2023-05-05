import { FastifyInstance } from 'fastify';

import { sessionsRoutes } from '@/modules/users/http/routes/sessions-routes';
import { userRoutes } from '@/modules/users/http/routes/users-routes';
import { profileRoutes } from '@/modules/users/http/routes/profile-routes';
import { eventsRoutes } from '@/modules/events/http/routes/events-routes';
import { tokenRoutes } from '@/modules/users/http/routes/token-routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(sessionsRoutes);
  app.register(profileRoutes);
  app.register(eventsRoutes);
  app.register(tokenRoutes);
}
