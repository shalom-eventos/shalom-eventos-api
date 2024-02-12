import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateEventRegistrationUseCase } from '../../use-cases/create-registration-use-case';

export async function createRegistrationController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      eventId: z.string().uuid(),
      credentialName: z.string().min(5).max(18),
      eventSource: z.string().optional(),
      transportationMode: z.enum(['TRANSPORTE PRÓPRIO', 'ÔNIBUS']),
      type: z.enum(['SERVO', 'PARTICIPANTE']),
      hasParticipatedPreviously: z.boolean(),
      acceptedTheTerms: z.boolean().refine((value) => value === true, {
        message: 'User must accept the terms',
        path: ['acceptedTheTerms'],
      }),
    })
    .strict();

  const userId = request.user.sub;
  const {
    eventId,
    eventSource,
    transportationMode,
    acceptedTheTerms,
    credentialName,
    type,
    hasParticipatedPreviously,
  } = bodySchema.parse(request.body);

  const createEventRegistration = new CreateEventRegistrationUseCase();

  const { registration } = await createEventRegistration.execute({
    userId,
    eventId,
    eventSource,
    transportationMode,
    acceptedTheTerms,
    credentialName,
    hasParticipatedPreviously,
    type,
  });

  return reply.status(200).send({ registration });
}
