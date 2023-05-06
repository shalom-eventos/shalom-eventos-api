import { PrismaRegistrationsRepository } from '../../repositories/prisma/prisma-registrations-repository';
import { ListRegistrationsByEventUseCase } from '../list-registrations-by-event-use-case';

export function makeListRegistrationsByEventUseCase() {
  const eventRegistrationsRepository = new PrismaRegistrationsRepository();

  const useCase = new ListRegistrationsByEventUseCase(
    eventRegistrationsRepository
  );

  return useCase;
}
