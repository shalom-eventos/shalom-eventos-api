import { FastifyRequest, FastifyReply } from 'fastify';
import { excludeFields } from '@/shared/utils/exclude-fields';
import { GetUserProfileUseCase } from '../../use-cases/get-user-profile';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request?.user?.sub;

  const getUserProfile = new GetUserProfileUseCase();

  const { user } = await getUserProfile.execute({ userId });

  return reply
    .status(200)
    .send({ user: excludeFields(user, ['passwordHash']) });
}
