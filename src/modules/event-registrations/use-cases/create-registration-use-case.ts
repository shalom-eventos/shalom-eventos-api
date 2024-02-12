import { EventRegistration } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { RegistrationsRepository } from '../repositories/registrations-repository';
import { ResourceNotFoundError } from './errors';
import { UserAlreadyRegisteredError } from './errors/user-already-registered-error';
import { ParticipantsRepository } from '@/modules/participants/repositories/participants-repository';
import { di } from '@/shared/lib/diContainer';

interface Request {
  userId: string;
  eventId: string;
  credentialName: string;
  eventSource?: string;
  transportationMode: string;
  acceptedTheTerms: boolean;
  type: string;
  hasParticipatedPreviously: boolean;
}

interface Response {
  registration: EventRegistration;
}

export class CreateEventRegistrationUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    ),
    private eventsRepository: EventsRepository = di.resolve('eventsRepository'),
    private usersRepository: UsersRepository = di.resolve('usersRepository'),
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    )
  ) {}

  async execute({
    userId,
    eventId,
    eventSource,
    transportationMode,
    acceptedTheTerms,
    credentialName,
    hasParticipatedPreviously,
    type,
  }: Request): Promise<Response> {
    const eventExists = await this.eventsRepository.findById(eventId);
    if (!eventExists) throw new ResourceNotFoundError('Event');

    const userExists = await this.usersRepository.findById(userId);
    if (!userExists || userExists.role !== 'PARTICIPANT')
      throw new ResourceNotFoundError('User');

    const participant = await this.participantsRepository.findByUser(userId);
    if (!participant) throw new ResourceNotFoundError('Participant');

    const registrationExits =
      await this.registrationsRepository.findOneByEventAndUser(eventId, userId);
    if (registrationExits) throw new UserAlreadyRegisteredError();

    const registration = await this.registrationsRepository.create({
      participantId: participant.id,
      eventId,
      eventSource,
      transportationMode,
      acceptedTheTerms,
      credentialName,
      hasParticipatedPreviously,
      type,
    });

    return { registration };
  }
}
