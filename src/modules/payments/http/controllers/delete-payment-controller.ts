import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdatePaymentStatusUseCase } from '../../use-cases/factories/make-update-ticket-use-case';
import { DeletePaymentUseCase } from '../../use-cases/delete-payment-use-case';

export async function deletePaymentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const updatePayment = new DeletePaymentUseCase();
  await updatePayment.execute({ paymentId: id });

  return reply.status(201).send();
}
