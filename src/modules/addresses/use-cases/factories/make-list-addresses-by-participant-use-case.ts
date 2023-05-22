import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { ListAddressesByParticipantUseCase } from '../list-addresses-by-participant-use-case';

export function makeListAddressesByParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new ListAddressesByParticipantUseCase(addressesRepository);

  return useCase;
}
