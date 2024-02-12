import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { UpdateEventTicketUseCase } from '../../use-cases/update-ticket-use-case';

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
      startsAt: z.coerce.date().optional(),
      expiresAt: z.coerce.date().optional(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const { title, price, startsAt, expiresAt } = bodySchema.parse(request.body);

  const updateTicket = new UpdateEventTicketUseCase();
  const { ticket } = await updateTicket.execute(id, {
    title,
    price,
    startsAt,
    expiresAt,
  });

  return reply.status(200).send({ ticket });
}
