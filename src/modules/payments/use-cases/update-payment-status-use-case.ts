import { Payment } from '@prisma/client';

import { RegistrationNotFoundError } from './errors';
import { PaymentsRepository } from '../repositories/payments-repository';

interface Request {
  paymentId: string;
}

interface Response {
  payment: Payment;
}

export class UpdatePaymentStatusUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({ paymentId }: Request): Promise<Response> {
    const payment = await this.paymentsRepository.findOneById(paymentId);
    if (!payment) throw new RegistrationNotFoundError();

    if (payment.status === 'approved') {
      payment.status = 'refused';
    } else {
      payment.status = 'approved';
    }

    await this.paymentsRepository.save(payment);

    return { payment };
  }
}
