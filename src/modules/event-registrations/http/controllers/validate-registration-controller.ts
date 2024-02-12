import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { ValidateRegistrationUseCase } from '../../use-cases/validate-registration-use-case';

export async function validateRegistrationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      registrationId: z.string().uuid(),
    })
    .strict();

  const { registrationId } = paramsSchema.parse(request.params);

  const validateRegistration = new ValidateRegistrationUseCase();

  const { registration } = await validateRegistration.execute({
    registrationId: registrationId,
  });

  return reply.status(200).send({ registration });
}
