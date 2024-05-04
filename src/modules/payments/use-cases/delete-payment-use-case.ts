import { Payment } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { PaymentsRepository } from '../repositories/payments-repository';
import { deleteFile } from '@/shared/utils/delete-file';
import { PaymentNotFoundError } from './errors/payment-not-found-error copy';

interface Request {
  paymentId?: string;
  eventRegistrationId?: string;
}

export class DeletePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository = di.resolve(
      'paymentsRepository'
    )
  ) {}

  async execute({ paymentId, eventRegistrationId }: Request): Promise<void> {
    let payment: Payment | null = null;
    if (paymentId) {
      payment = await this.paymentsRepository.findOneById(paymentId);
    } else if (eventRegistrationId) {
      payment = await this.paymentsRepository.findOneByRegistrationId(
        eventRegistrationId
      );
    }

    if (payment) {
      if (payment.file) await deleteFile(payment.file);
      await this.paymentsRepository.delete(payment.id);
    }

    return;
  }
}
