import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { UpdateAddressToParticipantUseCase } from '../update-address-to-participant-use-case';

export function makeUpdateAddressToParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new UpdateAddressToParticipantUseCase(
    addressesRepository,
    usersRepository
  );

  return useCase;
}
