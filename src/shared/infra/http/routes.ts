import { FastifyInstance } from 'fastify';

import { sessionsRoutes } from '@/modules/users/http/routes/sessions-routes';
import { userRoutes } from '@/modules/users/http/routes/users-routes';
import { profileRoutes } from '@/modules/users/http/routes/profile-routes';
import { eventsRoutes } from '@/modules/events/http/routes/events-routes';
import { tokenRoutes } from '@/modules/users/http/routes/token-routes';
import { addressesRoutes } from '@/modules/addresses/http/routes';
import { ticketsRoutes } from '@/modules/event-tickets/http/routes/tickets-routes';
import { registrationsRoutes } from '@/modules/event-registrations/http/routes';
import { paymentsRoutes } from '@/modules/payments/http/routes/payments-routes';
import { participantsRoutes } from '@/modules/participants/http/routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(userRoutes);
  app.register(sessionsRoutes);
  app.register(profileRoutes);
  app.register(eventsRoutes);
  app.register(tokenRoutes);
  app.register(addressesRoutes);
  app.register(ticketsRoutes);
  app.register(registrationsRoutes);
  app.register(paymentsRoutes);
  app.register(participantsRoutes);
}
