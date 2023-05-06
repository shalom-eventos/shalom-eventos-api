import { EventRegistration } from '@prisma/client';

import { RegistrationsRepository } from '../repositories/registrations-repository';

interface IRequest {
  user_id: string;
}

interface IResponse {
  registrations: EventRegistration[];
}

export class ListRegistrationsByUserUseCase {
  constructor(private registrationsRepository: RegistrationsRepository) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const registrations = await this.registrationsRepository.findManyByUser(
      user_id
    );

    return { registrations };
  }
}
