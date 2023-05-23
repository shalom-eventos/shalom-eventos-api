import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeRegisterParticipantUserAndAddressUseCase } from '../../use-cases/factories/make-register-participant-user-and-address-use-case';

export async function registerParticipantingUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
      password_confirmation: z.string().min(8),

      street: z.string(),
      street_number: z.string(),
      complement: z.string().optional(),
      zip_code: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),

      full_name: z.string().min(5),
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
    })
    .strict()
    .refine((data) => data.password === data.password_confirmation, {
      message: "Passwords don't match",
      path: ['password_confirmation'],
    });

  const {
    name,
    email,
    password,

    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,

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

  const registerParticipantingUser =
    makeRegisterParticipantUserAndAddressUseCase();

  const { participant } = await registerParticipantingUser.execute({
    name,
    email,
    password,

    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,

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
