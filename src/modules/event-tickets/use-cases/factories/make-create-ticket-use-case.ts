import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';
import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { CreateTicketUseCase } from '../create-ticket-use-case';

export function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const eventsRepository = new PrismaEventsRepository();

  const useCase = new CreateTicketUseCase(ticketsRepository, eventsRepository);

  return useCase;
}
