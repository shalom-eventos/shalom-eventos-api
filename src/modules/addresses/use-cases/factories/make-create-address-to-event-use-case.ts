import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { CreateAddressToEventUseCase } from '../create-address-to-event-use-case';

export function makeCreateAddressToEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const eventsRepository = new PrismaEventsRepository();

  const useCase = new CreateAddressToEventUseCase(
    addressesRepository,
    eventsRepository
  );

  return useCase;
}
