import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetUserProfileUseCase } from '../../use-cases/factories/make-get-user-profile-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request?.user?.sub;

  const getUserProfile = makeGetUserProfileUseCase();

  const { user } = await getUserProfile.execute({ userId });

  return reply.status(200).send({ ...user, password_hash: undefined });
}
