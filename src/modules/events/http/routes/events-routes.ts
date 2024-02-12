import { FastifyInstance } from 'fastify';

import { createEventController } from '../controllers/create-event-controller';
import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { getEventController } from '../controllers/get-event-controller';
import { updateEventController } from '../controllers/update-event-controller';
import { listEventsController } from '../controllers/list-events-controller';

export async function eventsRoutes(app: FastifyInstance) {
  app.get('/events/:id', getEventController);
  app.get('/events', listEventsController);

  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post('/events', middlewares, createEventController);
  app.put('/events/:id', middlewares, updateEventController);
}
