import { EventRegistration } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { RegistrationsRepository } from '../repositories/registrations-repository';

interface IRequest {
  event_id: string;
}

interface IResponse {
  registrations: EventRegistration[];
}

export class ListRegistrationsByEventUseCase {
  constructor(private registrationsRepository: RegistrationsRepository) {}

  async execute({ event_id }: IRequest): Promise<IResponse> {
    const registrations = await this.registrationsRepository.findManyByEvent(
      event_id
    );

    return { registrations };
  }
}
