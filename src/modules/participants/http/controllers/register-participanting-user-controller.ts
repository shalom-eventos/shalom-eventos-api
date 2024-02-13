import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { RegisterParticipantingUserAndAddressUseCase } from '../../use-cases/register-participanting-user-and-address-use-case';
import { deleteFile } from '@/shared/utils/delete-file';

export async function registerParticipantingUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      street: z.string(),
      streetNumber: z.string(),
      complement: z.string().optional(),
      zipCode: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),

      fullName: z.string().min(5),
      email: z.string().email(),
      phoneNumber: z.string(),
      birthdate: z.coerce.date(),
      documentNumber: z.string(),
      documentType: z.enum(['CPF', 'RG']),
      guardianName: z.string().optional().optional(),
      guardianPhoneNumber: z.string().optional().optional(),
      prayerGroup: z.string().optional().optional(),
      communityType: z.enum(['VIDA', 'ALIANÇA']).optional().optional(),
      pcdDescription: z.string().optional().optional(),
      allergyDescription: z.string().optional().optional(),
      medicationUseDescription: z.string().optional().optional(),

      eventId: z.string().uuid(),
      credentialName: z.string().min(5).max(18),
      eventSource: z.string().optional(),
      transportationMode: z.enum(['TRANSPORTE PRÓPRIO', 'ÔNIBUS']),
      type: z.enum(['SERVO', 'PARTICIPANTE']),
      hasParticipatedPreviously: z.coerce.boolean(),
      acceptedTheTerms: z.coerce.boolean().refine((value) => value === true, {
        message: 'User must accept the terms',
        path: ['accepted_the_terms'],
      }),

      paymentMethod: z.enum([
        'PIX',
        'DINHEIRO',
        'CARTÃO DE DÉBITO',
        'CARTÃO DE CRÉDITO',
      ]),
      price: z.coerce.number().positive(),
    })
    .strict();

  const file = request.file;

  const registerParticipantingUser =
    new RegisterParticipantingUserAndAddressUseCase();

  try {
    const { participant } = await registerParticipantingUser.execute({
      ...bodySchema.parse(request.body),
      file: String(file.filename),
    });

    return reply.status(200).send({ participant });
  } catch (err) {
    if (file.filename) if (file.filename) deleteFile(file.filename);
    throw err;
  }
}
