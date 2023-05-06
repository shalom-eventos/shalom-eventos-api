import { EventRegistration } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { RegistrationsRepository } from '../repositories/registrations-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  user_id: string;
  event_id: string;
  full_name: string;
  phone_number: string;
  age: number;
  document_number: string;
  document_type: string;
  guardian_name?: string;
  guardian_phone_number?: string;
  prayer_group?: string;
  event_source?: string;
  community_type?: string;
  pcd_description?: string;
  allergy_description?: string;
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
    full_name,
    phone_number,
    age,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    event_source,
    community_type,
    pcd_description,
    allergy_description,
    transportation_mode,
    accepted_the_terms,
  }: IRequest): Promise<IResponse> {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists) throw new ResourceNotFoundError();

    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists) throw new ResourceNotFoundError();

    const registration = await this.registrationsRepository.create({
      user_id,
      event_id,
      full_name,
      phone_number,
      age,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      event_source,
      community_type,
      pcd_description,
      allergy_description,
      transportation_mode,
      accepted_the_terms,
    });

    return { registration };
  }
}
