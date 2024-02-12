import { FastifyRequest, FastifyReply } from 'fastify';

import { ListAddressesByParticipantUseCase } from '../../use-cases/list-addresses-by-participant-use-case';

export async function listAddressesByParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request?.user?.sub;

  const listAddresses = new ListAddressesByParticipantUseCase();
  const { addresses } = await listAddresses.execute({ userId });

  return reply.status(200).send({ addresses });
}
