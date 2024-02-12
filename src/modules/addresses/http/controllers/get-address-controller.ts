import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { GetAddressUseCase } from '../../use-cases/get-address-use-case';

export async function getAddressController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const getAddress = new GetAddressUseCase();
  const { address } = await getAddress.execute({ id });

  return reply.status(200).send({ address });
}
