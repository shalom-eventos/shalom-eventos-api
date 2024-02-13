import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { DeleteRegistrationUseCase } from '../../use-cases/delete-registration-use-case';

export async function deleteRegistrationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      registrationId: z.string().uuid(),
    })
    .strict();

  const { registrationId } = paramsSchema.parse(request.params);

  const deleteRegistration = new DeleteRegistrationUseCase();

  await deleteRegistration.execute({
    registrationId,
    userLoggedId: request.user.sub,
  });

  return reply.status(201).send();
}
