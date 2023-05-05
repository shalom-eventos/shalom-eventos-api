import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateAddressToEventUseCase } from '../../use-cases/factories/make-create-address-to-event-use-case';

export async function createAddressToEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      street: z.string(),
      street_number: z.string(),
      complement: z.string().optional(),
      zip_code: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);

  const { street, street_number, complement, zip_code, district, city, state } =
    bodySchema.parse(request.body);

  const createAddress = makeCreateAddressToEventUseCase();
  const { address } = await createAddress.execute({
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
