import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { UpdateEventUseCase } from '@/modules/events/use-cases/update-event-use-case';

export async function updateEventController(
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
      slug: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const { title, description, startDate, endDate } = bodySchema.parse(
    request.body
  );

  const updateEvent = new UpdateEventUseCase();
  const { event } = await updateEvent.execute(id, {
    title,
    description,
    startDate,
    endDate,
  });

  return reply.status(200).send({ event });
}
