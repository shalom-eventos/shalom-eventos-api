import { PrismaEventsRepository } from '../../repositories/prisma/prisma-events-repository';
import { GetEventUseCase } from '../get-event-use-case';

export function makeGetEventEventUseCase() {
  const eventsRepository = new PrismaEventsRepository();
  const useCase = new GetEventUseCase(eventsRepository);

  return useCase;
}
