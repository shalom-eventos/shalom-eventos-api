import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeCreateEventUseCase } from '@modules/events/use-cases/factories/make-create-event-use-case';

export async function createEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      title: z.string(),
      description: z.string().optional(),
      start_date: z.coerce.date(),
      end_date: z.coerce.date().optional(),
    })
    .strict();

  const { title, description, start_date, end_date } = bodySchema.parse(
    request.body
  );

  const createEvent = makeCreateEventUseCase();
  const { event } = await createEvent.execute({
    title,
    description,
    start_date,
    end_date,
  });

  return reply.status(200).send({ event });
}
