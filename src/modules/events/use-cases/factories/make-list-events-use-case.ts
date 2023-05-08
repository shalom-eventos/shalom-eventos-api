import { PrismaEventsRepository } from '../../repositories/prisma/prisma-events-repository';
import { ListEventsUseCase } from '../list-evente-use-case';

export function makeListEventsUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new ListEventsUseCase(eventsRepository);

  return useCase;
}
