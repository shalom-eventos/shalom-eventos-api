import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeRegisterParticipantUserAndAddressUseCase } from '../../use-cases/factories/make-register-participant-user-and-address-use-case';

export async function registerParticipantingUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      street: z.string(),
      street_number: z.string(),
      complement: z.string().optional(),
      zip_code: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),

      full_name: z.string().min(5),
      email: z.string().email(),
      phone_number: z.string(),
      birthdate: z.coerce.date(),
      document_number: z.string(),
      document_type: z.enum(['CPF', 'RG']),
      guardian_name: z.string().optional().optional(),
      guardian_phone_number: z.string().optional().optional(),
      prayer_group: z.string().optional().optional(),
      community_type: z.enum(['VIDA', 'ALIANÇA']).optional().optional(),
      pcd_description: z.string().optional().optional(),
      allergy_description: z.string().optional().optional(),
      medication_use_description: z.string().optional().optional(),

      event_id: z.string().uuid(),
      credential_name: z.string().min(5).max(18),
      event_source: z.string().optional(),
      transportation_mode: z.enum(['TRANSPORTE PRÓPRIO', 'ÔNIBUS']),
      type: z.enum(['SERVO', 'PARTICIPANTE']),
      has_participated_previously: z.coerce.boolean(),
      accepted_the_terms: z.coerce.boolean().refine((value) => value === true, {
        message: 'User must accept the terms',
        path: ['accepted_the_terms'],
      }),

      payment_method: z.enum([
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
    makeRegisterParticipantUserAndAddressUseCase();

  const { participant } = await registerParticipantingUser.execute({
    ...bodySchema.parse(request.body),
    file: String(file.filename),
  });

  return reply.status(200).send({ participant });
}
