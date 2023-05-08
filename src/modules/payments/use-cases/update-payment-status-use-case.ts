import { Payment } from '@prisma/client';

import { ResourceNotFoundError } from './errors';
import { PaymentsRepository } from '../repositories/payments-repository';

interface IRequest {
  payment_id: string;
}

interface IResponse {
  payment: Payment;
}

export class UpdatePaymentStatusUseCase {
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute({ payment_id }: IRequest): Promise<IResponse> {
    const payment = await this.paymentsRepository.findById(payment_id);
    if (!payment) throw new ResourceNotFoundError();

    if (payment.status === 'approved') {
      payment.status = 'refused';
    } else {
      payment.status = 'approved';
    }

    await this.paymentsRepository.save(payment);

    return { payment };
  }
}
