import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { UpdateParticipantUseCase } from '../update-participant-use-case';

export function makeUpdateParticipantUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();

  const useCase = new UpdateParticipantUseCase(participantsRepository);

  return useCase;
}
