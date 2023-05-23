import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeListAddressesByEventUseCase } from '../../use-cases/factories/make-list-addresses-by-event-use-case';

export async function listAddressesByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);

  const listAddresses = makeListAddressesByEventUseCase();
  const { addresses } = await listAddresses.execute({ event_id });

  return reply.status(200).send({ addresses });
}
