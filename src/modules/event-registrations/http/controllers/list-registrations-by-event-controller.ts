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
      type: z.enum(['SERVO', 'PARTICIPANTE']).nullish(),
    })
    .strict();

  const { eventId, type } = querySchema.parse(request.query);

  const listRegistrationsByEvent = new ListRegistrationsByEventUseCase();

  const { registrations } = await listRegistrationsByEvent.execute({
    eventId,
    type: type ? String(type) : undefined,
  });

  return reply.status(200).send({ registrations });
}
