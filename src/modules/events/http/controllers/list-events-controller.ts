import { FastifyRequest, FastifyReply } from 'fastify';

import { makeListEventsUseCase } from '@/modules/events/use-cases/factories/make-list-events-use-case';

export async function listEventsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listEvents = makeListEventsUseCase();
  const { events } = await listEvents.execute();

  return reply.status(200).send({ events });
}
