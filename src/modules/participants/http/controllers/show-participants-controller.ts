import { FastifyRequest, FastifyReply } from 'fastify';

import { makeShowParticipantByUserUseCase } from '../../use-cases/factories/make-show-participant-by-user-use-case';

export async function showParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request.user.sub;

  const showParticipant = makeShowParticipantByUserUseCase();

  const { participant } = await showParticipant.execute({ user_id });

  return reply.status(200).send({ participant });
}
