import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { UpdateParticipantUseCase } from '../../use-cases/update-participant-use-case';

export async function updateParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      fullName: z.string().min(5).optional(),
      phoneNumber: z.string().optional(),
      birthdate: z.coerce.date().optional(),
      documentNumber: z.string().optional(),
      documentType: z.enum(['CPF', 'RG']).optional(),
      guardianName: z.string().optional().optional(),
      guardianPhoneNumber: z.string().optional().optional(),
      prayerGroup: z.string().optional().optional(),
      communityType: z.enum(['VIDA', 'ALIANÇA']).optional().optional(),
      pcdDescription: z.string().optional().optional(),
      allergyDescription: z.string().optional().optional(),
      medicationUseDescription: z.string().optional().optional(),
    })
    .strict();

  const userId = request.user.sub;
  const {
    fullName,
    phoneNumber,
    birthdate,
    documentNumber,
    documentType,
    guardianName,
    guardianPhoneNumber,
    prayerGroup,
    communityType,
    pcdDescription,
    allergyDescription,
    medicationUseDescription,
  } = bodySchema.parse(request.body);

  const updateParticipant = new UpdateParticipantUseCase();

  const { participant } = await updateParticipant.execute({
    userId,
    fullName,
    phoneNumber,
    birthdate,
    documentNumber,
    documentType,
    guardianName,
    guardianPhoneNumber,
    prayerGroup,
    communityType,
    pcdDescription,
    allergyDescription,
    medicationUseDescription,
  });

  return reply.status(200).send({ participant });
}
