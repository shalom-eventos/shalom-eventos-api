import { FastifyInstance } from 'fastify';

import { createEventController } from '../controllers/events/create-event-controller';
import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { getEventController } from '../controllers/events/get-event-controller';
import { updateEventController } from '../controllers/events/update-event-controller';

export async function eventsRoutes(app: FastifyInstance) {
  app.get('/events/:id', getEventController);

  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post('/events', middlewares, createEventController);
  app.put('/events/:id', middlewares, updateEventController);
}
