import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { RegisterParticipantingUserAndAddressUseCase } from '../register-participanting-user-and-address-use-case';
import { PrismaAddressesRepository } from '@/modules/addresses/repositories/prisma/prisma-addresses-repository';
import { PrismaRegistrationsRepository } from '@/modules/event-registrations/repositories/prisma/prisma-registrations-repository';
import { PrismaTicketsRepository } from '@/modules/event-tickets/repositories/prisma/prisma-addresses-repository';
import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaPaymentsRepository } from '@/modules/payments/repositories/prisma/prisma-payments-repository';

export function makeRegisterParticipantUserAndAddressUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const addressesRepository = new PrismaAddressesRepository();
  const registrationsRepository = new PrismaRegistrationsRepository();
  const eventsRepository = new PrismaEventsRepository();
  const paymentsRepository = new PrismaPaymentsRepository();
  const ticketsRepository = new PrismaTicketsRepository();

  const useCase = new RegisterParticipantingUserAndAddressUseCase(
    participantsRepository,
    addressesRepository,
    registrationsRepository,
    eventsRepository,
    paymentsRepository,
    ticketsRepository
  );

  return useCase;
}
