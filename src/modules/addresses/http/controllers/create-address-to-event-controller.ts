import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateAddressToEventUseCase } from '../../use-cases/create-address-to-event-use-case';

export async function createAddressToEventController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      eventId: z.string().uuid(),
      street: z.string(),
      streetNumber: z.string(),
      complement: z.string().optional(),
      zipCode: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),
    })
    .strict();

  const {
    eventId,
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,
  } = bodySchema.parse(request.body);

  const createAddress = new CreateAddressToEventUseCase();
  const { address } = await createAddress.execute({
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
