import { Participant } from '@prisma/client';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { ResourceNotFoundError } from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  userId: string;
}

interface Response {
  participant: Participant;
}

export class ShowParticipantByUserUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    )
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const participant = await this.participantsRepository.findByUser(userId);

    if (!participant) throw new ResourceNotFoundError('Participante data');

    return { participant };
  }
}
