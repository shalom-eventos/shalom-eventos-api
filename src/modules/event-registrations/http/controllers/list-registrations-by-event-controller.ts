import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeListRegistrationsByEventUseCase } from '../../use-cases/factories/make-list-registrations-by-event-use-case';

export async function listRegistrationsByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);

  const listRegistrationsByEvent = makeListRegistrationsByEventUseCase();

  const { registrations } = await listRegistrationsByEvent.execute({
    event_id,
  });

  return reply.status(200).send({ registrations });
}
