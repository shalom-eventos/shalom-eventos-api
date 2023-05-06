import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaRegistrationsRepository } from '../../repositories/prisma/prisma-registrations-repository';
import { CreateEventRegistrationUseCase } from '../create-registration-use-case';
import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';

export function makeCreateEventRegistrationUseCase() {
  const registrationsRepository = new PrismaRegistrationsRepository();
  const eventsRepository = new PrismaEventsRepository();
  const usersRepository = new PrismaUsersRepository();

  const useCase = new CreateEventRegistrationUseCase(
    registrationsRepository,
    eventsRepository,
    usersRepository
  );

  return useCase;
}
