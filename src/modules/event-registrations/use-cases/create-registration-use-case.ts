import { EventRegistration, Participant } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { RegistrationsRepository } from '../repositories/registrations-repository';
import { ResourceNotFoundError } from './errors';
import { UserAlreadyRegisteredError } from './errors/user-already-registered-error';
import { ParticipantsRepository } from '@/modules/participants/repositories/participants-repository';

interface IRequest {
  user_id: string;
  event_id: string;
  credential_name: string;
  event_source?: string;
  transportation_mode: string;
  accepted_the_terms: boolean;
  type: string;
  has_participated_previously: boolean;
}

interface IResponse {
  registration: EventRegistration;
}

export class CreateEventRegistrationUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository,
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository,
    private participantRepository: ParticipantsRepository
  ) {}

  async execute({
    user_id,
    event_id,
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name,
    has_participated_previously,
    type,
  }: IRequest): Promise<IResponse> {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists) throw new ResourceNotFoundError('Event');

    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists || userExists.role !== 'PARTICIPANT')
      throw new ResourceNotFoundError('User');

    const participant = await this.participantRepository.findByUser(user_id);
    if (!participant) throw new ResourceNotFoundError('Participant');

    const registrationExits =
      await this.registrationsRepository.findOneByEventAndUser(
        event_id,
        user_id
      );
    if (registrationExits) throw new UserAlreadyRegisteredError();

    const registration = await this.registrationsRepository.create({
      participant_id: participant.id,
      event_id,
      event_source,
      transportation_mode,
      accepted_the_terms,
      credential_name,
      has_participated_previously,
      type,
    });

    return { registration };
  }
}
