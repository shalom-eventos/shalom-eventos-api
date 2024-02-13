import { FastifyRequest, FastifyReply } from 'fastify';

import { ListAddressesByUserUseCase } from '../../use-cases/list-addresses-by-user-use-case';

export async function listAddressesByUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request?.user?.sub;

  const listAddresses = new ListAddressesByUserUseCase();
  const { addresses } = await listAddresses.execute({ userId });

  return reply.status(200).send({ addresses });
}
