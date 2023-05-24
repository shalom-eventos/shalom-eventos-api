import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdateParticipantUseCase } from '../../use-cases/factories/make-update-participant-use-case';

export async function updateParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      full_name: z.string().min(5).optional(),
      phone_number: z.string().optional(),
      birthdate: z.coerce.date().optional(),
      document_number: z.string().optional(),
      document_type: z.enum(['CPF', 'RG']).optional(),
      guardian_name: z.string().optional().optional(),
      guardian_phone_number: z.string().optional().optional(),
      prayer_group: z.string().optional().optional(),
      community_type: z.enum(['VIDA', 'ALIANÇA']).optional().optional(),
      pcd_description: z.string().optional().optional(),
      allergy_description: z.string().optional().optional(),
      medication_use_description: z.string().optional().optional(),
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
    medication_use_description,
  } = bodySchema.parse(request.body);

  const updateParticipant = makeUpdateParticipantUseCase();

  const { participant } = await updateParticipant.execute({
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
    medication_use_description,
  });

  return reply.status(200).send({ participant });
}
