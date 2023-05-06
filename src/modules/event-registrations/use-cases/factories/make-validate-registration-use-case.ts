import { PrismaRegistrationsRepository } from '../../repositories/prisma/prisma-registrations-repository';
import { ValidateRegistrationUseCase } from '../validate-registration-use-case';

export function makeValidateRegistrationUseCase() {
  const eventRegistrationsRepository = new PrismaRegistrationsRepository();

  const useCase = new ValidateRegistrationUseCase(eventRegistrationsRepository);

  return useCase;
}
