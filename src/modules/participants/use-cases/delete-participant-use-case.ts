import { di } from '@/shared/lib/diContainer';
import { UsersRepository } from '@/modules/users/repositories/users-repository';
import { ParticipantsRepository } from '../repositories/participants-repository';
import { ResourceNotFoundError } from './errors';
import { UserNotAuthorizedError } from './errors/user-not-authorized-error';
import { DeleteAddressesByParticipantUseCase } from '@/modules/addresses/use-cases/delete-addresses-by-participant-use-case';

interface Request {
  userLoggedId: string;
  participantId: string;
  preventIfExistsUser?: boolean;
}

export class DeleteParticipantUseCase {
  constructor(
    private usersRepository: UsersRepository = di.resolve('usersRepository'),
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    ),
    private deleteAddressesByParticipantUseCase = new DeleteAddressesByParticipantUseCase()
  ) {}

  async execute({
    userLoggedId,
    participantId,
    preventIfExistsUser = false,
  }: Request): Promise<void> {
    const userLogged = await this.usersRepository.findById(userLoggedId);
    if (!userLogged) throw new UserNotAuthorizedError();

    const participant = await this.participantsRepository.findById(
      participantId
    );
    if (!participant) throw new ResourceNotFoundError('Participant');

    const hasAccess =
      userLogged.id === participant.userId ||
      userLogged.role === 'ADMINISTRATOR';

    if (!hasAccess) throw new UserNotAuthorizedError();

    const existsUser = participant.userId !== null;
    if (preventIfExistsUser && existsUser) return;

    await this.deleteAddressesByParticipantUseCase.execute({ participantId });
    await this.participantsRepository.delete(participant.id);

    return;
  }
}
