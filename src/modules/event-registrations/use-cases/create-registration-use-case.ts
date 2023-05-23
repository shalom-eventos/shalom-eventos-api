import { EventRegistration } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { RegistrationsRepository } from '../repositories/registrations-repository';
import { ResourceNotFoundError } from './errors';
import { UserAlreadyRegisteredError } from './errors/user-already-registered-error';

interface IRequest {
  user_id: string;
  event_id: string;
  credential_name: string;
  event_source?: string;
  transportation_mode: string;
  accepted_the_terms: boolean;
}

interface IResponse {
  registration: EventRegistration;
}

export class CreateEventRegistrationUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository,
    private eventsRepository: EventsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    user_id,
    event_id,
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name,
  }: IRequest): Promise<IResponse> {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists) throw new ResourceNotFoundError('Event');

    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists) throw new ResourceNotFoundError('User');

    const registrationExtist =
      await this.registrationsRepository.findByEventAndUser(event_id, user_id);
    if (registrationExtist) throw new UserAlreadyRegisteredError();

    const registration = await this.registrationsRepository.create({
      user_id,
      event_id,
      event_source,
      transportation_mode,
      accepted_the_terms,
      credential_name,
    });

    return { registration };
  }
}
