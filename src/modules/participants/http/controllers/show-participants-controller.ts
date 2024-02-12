import { FastifyRequest, FastifyReply } from 'fastify';

import { ShowParticipantByUserUseCase } from '../../use-cases/show-participant-by-user-use-case';

export async function showParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub;

  const showParticipant = new ShowParticipantByUserUseCase();

  const { participant } = await showParticipant.execute({ userId });

  return reply.status(200).send({ participant });
}
