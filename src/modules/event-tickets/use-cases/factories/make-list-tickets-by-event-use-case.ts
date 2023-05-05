import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { ListTicketsByEventUseCase } from '../list-tickets-by-event-use-case';

export function makeListTicketsByEventUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new ListTicketsByEventUseCase(ticketsRepository);
  return useCase;
}
