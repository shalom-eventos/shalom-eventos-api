import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { CreateParticipantUseCase } from '../../use-cases/create-participant-use-case';

export async function createParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      fullName: z.string().min(5),
      phoneNumber: z.string(),
      birthdate: z.coerce.date(),
      documentNumber: z.string(),
      documentType: z.enum(['CPF', 'RG']),
      guardianName: z.string().optional(),
      guardianPhoneNumber: z.string().optional(),
      prayerGroup: z.string().optional(),
      communityType: z.enum(['VIDA', 'ALIANÇA']).optional(),
      pcdDescription: z.string().optional(),
      allergyDescription: z.string().optional(),
      medicationUseDescription: z.string().optional(),
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

  const createParticipant = new CreateParticipantUseCase();

  const { participant } = await createParticipant.execute({
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
