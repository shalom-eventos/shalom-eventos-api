import { Participant } from '@prisma/client';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  user_id: string;
}

interface IResponse {
  participant: Participant;
}

export class ShowParticipantByUserUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const participant = await this.participantsRepository.findByUser(user_id);

    if (!participant) throw new ResourceNotFoundError('Participante data');

    return { participant };
  }
}
