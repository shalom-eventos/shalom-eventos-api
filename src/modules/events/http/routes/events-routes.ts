import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { createEventController } from '../controllers/create-event-controller';
import { getEventController } from '../controllers/get-event-controller';
import { updateEventController } from '../controllers/update-event-controller';
import { listEventsController } from '../controllers/list-events-controller';
import { getNextEventController } from '../controllers/get-next-event-controller';

export async function eventsRoutes(app: FastifyInstance) {
  app.get('/events/:id', getEventController);
  app.get('/events', listEventsController);
  app.get('/events/next', getNextEventController);

  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post('/events', middlewares, createEventController);
  app.put('/events/:id', middlewares, updateEventController);
}
