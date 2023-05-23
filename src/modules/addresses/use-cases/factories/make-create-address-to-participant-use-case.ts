import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { CreateAddressToParticipantUseCase } from '../create-address-to-participant-use-case';

export function makeCreateAddressToParticipantUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CreateAddressToParticipantUseCase(
    addressesRepository,
    usersRepository
  );

  return useCase;
}
