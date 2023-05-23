import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdateAddressToParticipantUseCase } from '../../use-cases/factories/make-update-address-to-participant-use-case';

export async function updateAddressToParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request?.user?.sub;

  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      street: z.string().optional(),
      street_number: z.string().optional(),
      complement: z.string().optional(),
      zip_code: z.string().optional(),
      district: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const { street, street_number, complement, zip_code, district, city, state } =
    bodySchema.parse(request.body);

  const updateAddress = makeUpdateAddressToParticipantUseCase();
  const { address } = await updateAddress.execute({
    address_id: id,
    user_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
  });

  return reply.status(200).send({ address });
}
