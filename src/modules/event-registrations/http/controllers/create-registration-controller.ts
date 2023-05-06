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
      full_name: z.string().min(5),
      phone_number: z.string(),
      age: z.number().int().positive(),
      document_number: z.string(),
      document_type: z.enum(['CPF', 'RG']),
      guardian_name: z.string().optional(),
      guardian_phone_number: z.string().optional(),
      prayer_group: z.string().optional(),
      event_source: z.string().optional(),
      community_type: z.enum(['VIDA', 'ALIANÇA']).optional(),
      pcd_description: z.string().optional(),
      allergy_description: z.string().optional(),
      transportation_mode: z.enum(['TRANSPORTE PRÓPRIO', 'ÔNIBUS']),
      accepted_the_terms: z.boolean().refine((value) => value === true, {
        message: 'User must accept the terms',
        path: ['accepted_the_terms'],
      }),
    })
    .strict();

  const user_id = request.user.sub;
  const { event_id } = paramsSchema.parse(request.params);
  const {
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms,
  } = bodySchema.parse(request.body);

  const createEventRegistration = makeCreateEventRegistrationUseCase();

  const { registration } = await createEventRegistration.execute({
    user_id,
    event_id,
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms,
  });

  return reply.status(200).send({ registration });
}
