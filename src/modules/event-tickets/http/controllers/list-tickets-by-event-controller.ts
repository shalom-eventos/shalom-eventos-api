import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeListTicketsByEventUseCase } from '../../use-cases/factories/make-list-tickets-by-event-use-case';

export async function listTicketsByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);

  const listTickets = makeListTicketsByEventUseCase();
  const { tickets } = await listTickets.execute({ event_id });

  return reply.status(200).send({ tickets });
}
