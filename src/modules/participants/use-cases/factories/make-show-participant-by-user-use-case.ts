import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { ShowParticipantByUserUseCase } from '../show-participant-by-user-use-case';

export function makeShowParticipantByUserUseCase() {
  const participantssRepository = new PrismaParticipantsRepository();

  const useCase = new ShowParticipantByUserUseCase(participantssRepository);

  return useCase;
}
