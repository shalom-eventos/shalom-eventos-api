import { EventRegistration } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { ResourceNotFoundError } from './errors';
import { RegistrationsRepository } from '../repositories/registrations-repository';

interface Request {
  registrationId: string;
}

interface Response {
  registration: EventRegistration;
}

export class ValidateRegistrationUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    )
  ) {}

  async execute({ registrationId }: Request): Promise<Response> {
    const registration = await this.registrationsRepository.findOneById(
      registrationId
    );
    if (!registration) throw new ResourceNotFoundError('Registration');

    registration.isApproved = !registration.isApproved;

    await this.registrationsRepository.save(registration);

    return { registration };
  }
}
