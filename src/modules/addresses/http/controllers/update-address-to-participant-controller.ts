import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { UpdateAddressToParticipantUseCase } from '../../use-cases/update-address-to-participant-use-case';

export async function updateAddressToParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request?.user?.sub;

  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      street: z.string().optional(),
      streetNumber: z.string().optional(),
      complement: z.string().optional(),
      zipCode: z.string().optional(),
      district: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const { street, streetNumber, complement, zipCode, district, city, state } =
    bodySchema.parse(request.body);

  const updateAddress = new UpdateAddressToParticipantUseCase();
  const { address } = await updateAddress.execute({
    addressId: id,
    userId,
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,
  });

  return reply.status(200).send({ address });
}
