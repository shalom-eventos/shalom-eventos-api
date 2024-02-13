import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateAddressToUserUseCase } from '../../use-cases/create-address-to-user-use-case';

export async function createAddressToUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request?.user?.sub;

  const bodySchema = z
    .object({
      street: z.string(),
      streetNumber: z.string(),
      complement: z.string().optional(),
      zipCode: z.string(),
      district: z.string(),
      city: z.string(),
      state: z.string(),
    })
    .strict();

  const { street, streetNumber, complement, zipCode, district, city, state } =
    bodySchema.parse(request.body);

  const createAddress = new CreateAddressToUserUseCase();
  const { address } = await createAddress.execute({
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
