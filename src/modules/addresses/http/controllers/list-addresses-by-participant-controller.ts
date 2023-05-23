import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeGetAddressEventUseCase } from '../../use-cases/factories/make-get-address-use-case';
import { makeListAddressesByParticipantUseCase } from '../../use-cases/factories/make-list-addresses-by-participant-use-case';

export async function listAddressesByParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request?.user?.sub;

  const listAddresses = makeListAddressesByParticipantUseCase();
  const { addresses } = await listAddresses.execute({ user_id });

  return reply.status(200).send({ addresses });
}
