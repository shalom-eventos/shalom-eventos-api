import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { UpdateAddressToEventUseCase } from '../../use-cases/update-address-to-event-use-case';

export async function updateAddressToEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      addressId: z.string().uuid(),
      eventId: z.string().uuid(),
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

  const { addressId, eventId } = paramsSchema.parse(request.params);

  const { street, streetNumber, complement, zipCode, district, city, state } =
    bodySchema.parse(request.body);

  const updateAddress = new UpdateAddressToEventUseCase();
  const { address } = await updateAddress.execute({
    addressId,
    eventId,
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
