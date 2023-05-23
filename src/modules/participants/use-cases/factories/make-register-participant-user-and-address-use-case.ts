import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { RegisterParticipantingUserAndAddressUseCase } from '../register-participanting-user-and-address-use-case';
import { PrismaAddressesRepository } from '@/modules/addresses/repositories/prisma/prisma-addresses-repository';

export function makeRegisterParticipantUserAndAddressUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();
  const addressesRepository = new PrismaAddressesRepository();

  const useCase = new RegisterParticipantingUserAndAddressUseCase(
    participantsRepository,
    usersRepository,
    addressesRepository
  );

  return useCase;
}
