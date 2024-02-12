import { di } from '@/shared/lib/diContainer';
import {
  ParticipantWithRelationsType,
  ParticipantsRepository,
} from '../repositories/participants-repository';

interface Response {
  participants: ParticipantWithRelationsType[];
}

// only admins should be able to access this use-case
export class ListParticipantsWithUserUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    )
  ) {}

  async execute(): Promise<Response> {
    const participants =
      await this.participantsRepository.findManyWithAddresses();

    return { participants };
  }
}
