import { PrismaTicketsRepository } from '@/modules/event-tickets/repositories/prisma/prisma-addresses-repository';
import { PrismaRegistrationsRepository } from '@/modules/event-registrations/repositories/prisma/prisma-registrations-repository';
import { PrismaPaymentsRepository } from '../../repositories/prisma/prisma-payments-repository';
import { CreatePaymentUseCase } from '../create-payment-use-case';

export function makeCreatePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentsRepository();
  const registrationsRepository = new PrismaRegistrationsRepository();
  const ticketsRepository = new PrismaTicketsRepository();

  const useCase = new CreatePaymentUseCase(
    paymentsRepository,
    registrationsRepository,
    ticketsRepository
  );

  return useCase;
}
