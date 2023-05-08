import { FastifyRequest, FastifyReply } from 'fastify';
import { File } from 'fastify-multer/src/interfaces';

import { z } from 'zod';

import { makeCreatePaymentUseCase } from '../../use-cases/factories/make-create-payment-use-case';

export async function createPaymentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_registration_id: z.string().uuid(),
    })
    .strict();

  const bodySchema = z
    .object({
      event_ticket_id: z.string().uuid(),
      payment_method: z.string(),
      price: z.coerce.number().positive(),
    })
    .strict();

  // const requestSchema = z.object({
  //   file: z.instanceof(File),
  // });

  const user_id = request.user.sub;
  const file = request.file;
  const { event_registration_id } = paramsSchema.parse(request.params);
  const { event_ticket_id, payment_method, price } = bodySchema.parse(
    request.body
  );

  const createPayment = makeCreatePaymentUseCase();

  const { payment } = await createPayment.execute({
    user_id,
    event_registration_id,
    event_ticket_id,
    payment_method,
    price,
    file: String(file.filename),
  });

  return reply.status(200).send({ payment });
}
