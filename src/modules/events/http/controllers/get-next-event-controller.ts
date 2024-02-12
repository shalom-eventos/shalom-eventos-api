import { FastifyRequest, FastifyReply } from 'fastify';

import { GetNextEventUseCase } from '@/modules/events/use-cases/get-next-event-use-case';

export async function getNextEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getEvent = new GetNextEventUseCase();
  const { event } = await getEvent.execute();

  return reply.status(200).send({ event });
}
