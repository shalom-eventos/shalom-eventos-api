import { FastifyRequest, FastifyReply } from 'fastify';
import { ListEventsUseCase } from '@/modules/events/use-cases/list-events-use-case';

export async function listEventsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const listEvents = new ListEventsUseCase();
  const { events } = await listEvents.execute();

  return reply.status(200).send({ events });
}
