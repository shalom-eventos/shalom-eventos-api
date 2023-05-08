import { PrismaPaymentsRepository } from '../../repositories/prisma/prisma-payments-repository';
import { UpdatePaymentStatusUseCase } from '../update-payment-status-use-case';

export function makeUpdatePaymentStatusUseCase() {
  const paymentsRepository = new PrismaPaymentsRepository();
  const useCase = new UpdatePaymentStatusUseCase(paymentsRepository);

  return useCase;
}
