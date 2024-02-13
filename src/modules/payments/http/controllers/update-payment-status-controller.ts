import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

import { makeUpdatePaymentStatusUseCase } from '../../use-cases/factories/make-update-ticket-use-case';

export async function updatePaymentStatusController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      id: z.string().uuid(),
    })
    .strict();

  const { id } = paramsSchema.parse(request.params);

  const updatePayment = makeUpdatePaymentStatusUseCase();
  const { payment } = await updatePayment.execute({ paymentId: id });

  return reply.status(200).send({ payment });
}
