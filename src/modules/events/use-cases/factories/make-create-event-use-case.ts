import { PrismaEventsRepository } from '../../repositories/prisma/prisma-events-repository';
import { CreateEventUseCase } from '../create-event-use-case';

export function makeCreateEventUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new CreateEventUseCase(eventsRepository);

  return useCase;
}
