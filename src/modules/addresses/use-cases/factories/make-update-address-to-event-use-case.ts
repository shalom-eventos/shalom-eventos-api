import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { UpdateAddressToEventUseCase } from '../update-address-to-event-use-case';

export function makeUpdateAddressToEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();

  const useCase = new UpdateAddressToEventUseCase(addressesRepository);

  return useCase;
}
