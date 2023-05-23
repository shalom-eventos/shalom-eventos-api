import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { ListAddressesByEventUseCase } from '../list-addresses-by-event-use-case';

export function makeListAddressesByEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new ListAddressesByEventUseCase(addressesRepository);

  return useCase;
}
