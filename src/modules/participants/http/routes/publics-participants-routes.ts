import { FastifyInstance } from 'fastify';

import { registerParticipantingUserController } from '../controllers/register-participanting-user-controller';

export async function publicsParticipantsRoutes(app: FastifyInstance) {
  app.post('/participants/register', registerParticipantingUserController);
}
