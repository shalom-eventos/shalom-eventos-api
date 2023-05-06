import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeValidateRegistrationUseCase } from '../../use-cases/factories/make-validate-registration-use-case';

export async function validateRegistrationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      registration_id: z.string().uuid(),
    })
    .strict();

  const { registration_id } = paramsSchema.parse(request.params);

  const validateRegistration = makeValidateRegistrationUseCase();

  const { registration } = await validateRegistration.execute({
    registration_id,
  });

  return reply.status(200).send({ registration });
}
