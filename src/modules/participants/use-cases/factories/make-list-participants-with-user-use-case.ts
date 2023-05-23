import { PrismaParticipantsRepository } from '../../repositories/prisma/prisma-participants-repository';
import { ListParticipantsWithUserUseCase } from '../list-participants-with-user-use-case';

export function makeListParticipantsWithUserUseCase() {
  const participantsRepository = new PrismaParticipantsRepository();

  const useCase = new ListParticipantsWithUserUseCase(participantsRepository);

  return useCase;
}
