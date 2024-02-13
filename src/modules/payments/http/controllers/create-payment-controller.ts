import { FastifyRequest, FastifyReply } from 'fastify';
import { File } from 'fastify-multer/src/interfaces';

import { z } from 'zod';

import { makeCreatePaymentUseCase } from '../../use-cases/factories/make-create-payment-use-case';
import { deleteFile } from '@/shared/utils/delete-file';

export async function createPaymentController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const bodySchema = z
    .object({
      eventRegistrationId: z.string().uuid(),
      paymentMethod: z.enum([
        'PIX',
        'DINHEIRO',
        'CARTÃO DE DÉBITO',
        'CARTÃO DE CRÉDITO',
      ]),
      price: z.coerce.number().positive(),
    })
    .strict();

  // const requestSchema = z.object({
  //   file: z.instanceof(File),
  // });

  const userId = request.user.sub;
  const file = request.file;

  try {
    const { eventRegistrationId, paymentMethod, price } = bodySchema.parse(
      request.body
    );

    const createPayment = makeCreatePaymentUseCase();

    const { payment } = await createPayment.execute({
      userId,
      eventRegistrationId,
      paymentMethod,
      price,
      file: String(file.filename),
    });

    return reply.status(200).send({ payment });
  } catch (err) {
    if (file.filename) deleteFile(file.filename);
    throw err;
  }
}
