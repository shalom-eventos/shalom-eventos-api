import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdateAddressToEventUseCase } from '../../use-cases/factories/make-update-address-to-event-use-case';

export async function updateAddressToEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      address_id: z.string().uuid(),
      event_id: z.string().uuid(),
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

  const { address_id, event_id } = paramsSchema.parse(request.params);

  const { street, street_number, complement, zip_code, district, city, state } =
    bodySchema.parse(request.body);

  const updateAddress = makeUpdateAddressToEventUseCase();
  const { address } = await updateAddress.execute({
    address_id,
    event_id,
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
