import { EventRegistration } from '@prisma/client';

import { RegistrationsRepository } from '../repositories/registrations-repository';
import { FindManyByEventResponse } from '../dtos/IFindManyByEventResponse';

interface IRequest {
  event_id: string;
}

interface IResponse {
  registrations: FindManyByEventResponse[];
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
