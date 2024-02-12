import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { ListTicketsByEventUseCase } from '../../use-cases/list-tickets-by-event-use-case';

export async function listTicketsByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z
    .object({
      eventId: z.string().uuid(),
    })
    .strict();

  const { eventId } = querySchema.parse(request.query);

  const listTickets = new ListTicketsByEventUseCase();
  const { tickets } = await listTickets.execute({ eventId });

  return reply.status(200).send({ tickets });
}
