import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { CreateTicketUseCase } from '../../use-cases/create-ticket-use-case';

export async function createTicketController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      eventId: z.string().uuid(),
      title: z.string(),
      price: z.number().positive(),
      startsAt: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
    })
    .strict();

  const { eventId, title, price, startsAt, expiresAt } = bodySchema.parse(
    request.body
  );

  const createTicket = new CreateTicketUseCase();

  const { ticket } = await createTicket.execute({
    eventId,
    title,
    price,
    startsAt,
    expiresAt,
  });

  return reply.status(200).send({ ticket });
}
