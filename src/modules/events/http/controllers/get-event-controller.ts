import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { GetEventUseCase } from '@/modules/events/use-cases/get-event-use-case';

export async function getEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const getEvent = new GetEventUseCase();
  const { event } = await getEvent.execute({ id });

  return reply.status(200).send({ event });
}
