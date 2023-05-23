import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeCreateParticipantUseCase } from '../../use-cases/factories/make-create-participant-use-case';

export async function createParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      full_name: z.string().min(5),
      phone_number: z.string(),
      birthdate: z.coerce.date(),
      document_number: z.string(),
      document_type: z.enum(['CPF', 'RG']),
      guardian_name: z.string().optional(),
      guardian_phone_number: z.string().optional(),
      prayer_group: z.string().optional(),
      community_type: z.enum(['VIDA', 'ALIANÇA']).optional(),
      pcd_description: z.string().optional(),
      allergy_description: z.string().optional(),
    })
    .strict();

  const user_id = request.user.sub;
  const {
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description,
  } = bodySchema.parse(request.body);

  const createParticipant = makeCreateParticipantUseCase();

  const { participant } = await createParticipant.execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description,
  });

  return reply.status(200).send({ participant });
}
