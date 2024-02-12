import { FastifyRequest, FastifyReply } from 'fastify';

import { ListParticipantsWithUserUseCase } from '../../use-cases/list-participants-with-user-use-case';

export async function listParticipantsController(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const listParticipants = new ListParticipantsWithUserUseCase();

  const { participants } = await listParticipants.execute();

  return reply.status(200).send({ participants });
}
