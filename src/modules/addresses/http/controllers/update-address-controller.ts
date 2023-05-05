import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdateAddressUseCase } from '../../use-cases/factories/make-update-address-use-case';

export async function updateAddressController(
  request: FastifyRequest,
  reply: FastifyReply
) {
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

  const updateAddress = makeUpdateAddressUseCase();
  const { address } = await updateAddress.execute(id, {
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
