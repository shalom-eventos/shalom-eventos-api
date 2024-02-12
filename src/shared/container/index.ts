import { asClass, Lifetime } from 'awilix';
import { di } from '@/shared/lib/diContainer';
import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaAddressesRepository } from '@/modules/addresses/repositories/prisma/prisma-addresses-repository';
import { PrismaRegistrationsRepository } from '@/modules/event-registrations/repositories/prisma/prisma-registrations-repository';
import { PrismaTicketsRepository } from '@/modules/event-tickets/repositories/prisma/prisma-addresses-repository';
import { PrismaParticipantsRepository } from '@/modules/participants/repositories/prisma/prisma-participants-repository';
import { PrismaPaymentsRepository } from '@/modules/payments/repositories/prisma/prisma-payments-repository';

di.register({
  usersRepository: asClass(PrismaUsersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  eventsRepository: asClass(PrismaEventsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  addressesRepository: asClass(PrismaAddressesRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  registrationsRepository: asClass(PrismaRegistrationsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  ticketsRepository: asClass(PrismaTicketsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  participantsRepository: asClass(PrismaParticipantsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  paymentsRepository: asClass(PrismaPaymentsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
});
