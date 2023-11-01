import { EventRegistration } from '@prisma/client';
import { ResourceNotFoundError } from './errors';
import { RegistrationsRepository } from '../repositories/registrations-repository';

interface IRequest {
  registration_id: string;
}

interface IResponse {
  registration: EventRegistration;
}

export class ValidateRegistrationUseCase {
  constructor(private registrationsRepository: RegistrationsRepository) {}

  async execute({ registration_id }: IRequest): Promise<IResponse> {
    const registration = await this.registrationsRepository.findOneById(
      registration_id
    );
    if (!registration) throw new ResourceNotFoundError('Registration');

    registration.is_approved = !registration.is_approved;

    await this.registrationsRepository.save(registration);

    return { registration };
  }
}
