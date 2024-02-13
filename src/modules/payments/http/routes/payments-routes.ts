import { FastifyInstance } from 'fastify';

import { verifyUserRole } from '@/shared/infra/http/middlewares/verify-user-role';
import { verifyJWT } from '@/shared/infra/http/middlewares/verify-jwt';
import { multer } from '@/shared/lib/multer';

import { createPaymentController } from '../controllers/create-payment-controller';
import { updatePaymentStatusController } from '../controllers/update-payment-status-controller';

export async function paymentsRoutes(app: FastifyInstance) {
  const participantMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('PARTICIPANT')],
    preHandler: multer.single('file'),
  };
  const adminMiddlewares = {
    onRequest: [verifyJWT, verifyUserRole('ADMINISTRATOR')],
  };

  app.post('/payments', participantMiddlewares, createPaymentController);
  app.patch(
    '/payments/:id/update-status',
    adminMiddlewares,
    updatePaymentStatusController
  );
}
