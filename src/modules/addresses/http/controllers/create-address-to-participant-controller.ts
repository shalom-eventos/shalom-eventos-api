import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { makeCreateAddressToParticipantUseCase } from '../../use-cases/factories/make-create-address-to-participant-use-case';

export async function createAddressToParticipantController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user_id = request?.user?.sub;

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

  const { street, street_number, complement, zip_code, district, city, state } =
    bodySchema.parse(request.body);

  const createAddress = makeCreateAddressToParticipantUseCase();
  const { address } = await createAddress.execute({
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
