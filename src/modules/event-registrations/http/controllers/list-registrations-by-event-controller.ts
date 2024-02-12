import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { ListRegistrationsByEventUseCase } from '../../use-cases/list-registrations-by-event-use-case';

export async function listRegistrationsByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z
    .object({
      eventId: z.string().uuid(),
    })
    .strict();

  const { eventId } = querySchema.parse(request.query);

  const listRegistrationsByEvent = new ListRegistrationsByEventUseCase();

  const { registrations } = await listRegistrationsByEvent.execute({
    eventId,
  });

  return reply.status(200).send({ registrations });
}
