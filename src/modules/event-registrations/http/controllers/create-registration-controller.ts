import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateEventRegistrationUseCase } from '../../use-cases/factories/make-create-registration-use-case';

export async function createRegistrationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      credential_name: z.string().min(5).max(18),
      event_source: z.string().optional(),
      transportation_mode: z.enum(['TRANSPORTE PRÓPRIO', 'ÔNIBUS']),
      type: z.enum(['SERVO', 'PARTICIPANTE']),
      has_participated_previously: z.boolean(),
      accepted_the_terms: z.boolean().refine((value) => value === true, {
        message: 'User must accept the terms',
        path: ['accepted_the_terms'],
      }),
    })
    .strict();

  const user_id = request.user.sub;
  const { event_id } = paramsSchema.parse(request.params);
  const {
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name,
    type,
    has_participated_previously,
  } = bodySchema.parse(request.body);

  const createEventRegistration = makeCreateEventRegistrationUseCase();

  const { registration } = await createEventRegistration.execute({
    user_id,
    event_id,
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name,
    has_participated_previously,
    type,
  });

  return reply.status(200).send({ registration });
}
