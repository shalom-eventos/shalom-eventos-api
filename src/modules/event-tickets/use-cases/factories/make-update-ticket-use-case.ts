import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { UpdateEventTicketUseCase } from '../update-ticket-use-case';

export function makeUpdateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();
  const useCase = new UpdateEventTicketUseCase(ticketsRepository);
  return useCase;
}
