import { PrismaRegistrationsRepository } from '../../repositories/prisma/prisma-registrations-repository';
import { ListRegistrationsByUserUseCase } from '../list-registrations-by-user-use-case';

export function makeListRegistrationsByUserUseCase() {
  const registrationsRepository = new PrismaRegistrationsRepository();

  const useCase = new ListRegistrationsByUserUseCase(registrationsRepository);

  return useCase;
}
