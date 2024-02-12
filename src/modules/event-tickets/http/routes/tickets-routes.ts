import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';

import { createTicketController } from '../controllers/create-ticket-controller';
import { listTicketsByEventController } from '../controllers/list-tickets-by-event-controller';
import { updateTicketController } from '../controllers/update-ticket-controller';

export async function ticketsRoutes(app: FastifyInstance) {
  app.get('/tickets', listTicketsByEventController);

  const middlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post('/tickets', middlewares, createTicketController);
  app.put('/tickets/:id', middlewares, updateTicketController);
}
