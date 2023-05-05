import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeCreateTicketUseCase } from '../../use-cases/factories/make-create-ticket-use-case';

export async function createTicketController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      title: z.string(),
      price: z.number().positive(),
      expires_in: z.coerce.date().optional(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);
  const { title, price, expires_in } = bodySchema.parse(request.body);

  const createTicket = makeCreateTicketUseCase();

  const { ticket } = await createTicket.execute({
    event_id,
    title,
    price,
    expires_in,
  });

  return reply.status(200).send({ ticket });
}
