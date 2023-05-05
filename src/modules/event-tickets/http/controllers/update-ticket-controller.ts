import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeUpdateTicketUseCase } from '../../use-cases/factories/make-update-ticket-use-case';

export async function updateTicketController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      title: z.string().optional(),
      price: z.number().optional(),
      expires_in: z.coerce.date().optional(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const { title, price, expires_in } = bodySchema.parse(request.body);

  const updateTicket = makeUpdateTicketUseCase();
  const { ticket } = await updateTicket.execute(id, {
    title,
    price,
    expires_in,
  });

  return reply.status(200).send({ ticket });
}
