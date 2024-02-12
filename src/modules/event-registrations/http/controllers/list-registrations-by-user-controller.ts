import { FastifyRequest, FastifyReply } from 'fastify';

import { ListRegistrationsByUserUseCase } from '../../use-cases/list-registrations-by-user-use-case';

export async function listRegistrationsByUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub;

  const listRegistrationsByUser = new ListRegistrationsByUserUseCase();

  const { registrations } = await listRegistrationsByUser.execute({
    userId,
  });

  return reply.status(200).send({ registrations });
}
