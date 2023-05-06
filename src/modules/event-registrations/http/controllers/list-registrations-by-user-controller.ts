import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeListRegistrationsByUserUseCase } from '../../use-cases/factories/make-list-registrations-by-user-use-case';

export async function listRegistrationsByUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request.user.sub;

  const listRegistrationsByUser = makeListRegistrationsByUserUseCase();

  const { registrations } = await listRegistrationsByUser.execute({
    user_id,
  });

  return reply.status(200).send({ registrations });
}
