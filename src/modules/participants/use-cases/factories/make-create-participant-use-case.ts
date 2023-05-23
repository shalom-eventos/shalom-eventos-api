import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { CreateParticipantUseCase } from '../create-participant-use-case';

export function makeCreateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CreateParticipantUseCase(
    participantsRepository,
    usersRepository
  );

  return useCase;
}
