import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaRegistrationsRepository } from '../../repositories/prisma/prisma-registrations-repository';
import { CreateEventRegistrationUseCase } from '../create-registration-use-case';
import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaParticipantsRepository } from '@/modules/participants/repositories/prisma/prisma-participants-repository';

export function makeCreateEventRegistrationUseCase() {
  const registrationsRepository = new PrismaRegistrationsRepository();
  const eventsRepository = new PrismaEventsRepository();
  const usersRepository = new PrismaUsersRepository();
  const participantRepository = new PrismaParticipantsRepository();

  const useCase = new CreateEventRegistrationUseCase(
    registrationsRepository,
    eventsRepository,
    usersRepository,
    participantRepository
  );

  return useCase;
}
