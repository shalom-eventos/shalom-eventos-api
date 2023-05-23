import { FastifyRequest, FastifyReply } from 'fastify';

import { makeListParticipantsWithUserUseCase } from '../../use-cases/factories/make-list-participants-with-user-use-case';

export async function listParticipantsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listParticipants = makeListParticipantsWithUserUseCase();

  const { participants } = await listParticipants.execute();

  return reply.status(200).send({ participants });
}
