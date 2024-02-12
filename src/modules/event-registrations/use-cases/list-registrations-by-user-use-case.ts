import { EventRegistration } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { RegistrationsRepository } from '../repositories/registrations-repository';

interface Request {
  userId: string;
}

interface Response {
  registrations: EventRegistration[];
}

export class ListRegistrationsByUserUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    )
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const registrations = await this.registrationsRepository.findManyByUser(
      userId
    );

    return { registrations };
  }
}
