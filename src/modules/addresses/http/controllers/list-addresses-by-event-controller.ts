import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { ListAddressesByEventUseCase } from '../../use-cases/list-addresses-by-event-use-case';

export async function listAddressesByEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      eventId: z.string().uuid(),
    })
    .strict();

  const { eventId } = paramsSchema.parse(request.params);

  const listAddresses = new ListAddressesByEventUseCase();
  const { addresses } = await listAddresses.execute({ eventId });

  return reply.status(200).send({ addresses });
}
