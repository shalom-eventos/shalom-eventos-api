import {
  ParticipantWithRelationsType,
  ParticipantsRepository,
} from '../repositories/participants-repository';

interface IResponse {
  participants: ParticipantWithRelationsType[];
}

// only admins should be able to access this use-case
export class ListParticipantsWithUserUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

  async execute(): Promise<IResponse> {
    const participants =
      await this.participantsRepository.findManyWithAddresses();

    return { participants };
  }
}
