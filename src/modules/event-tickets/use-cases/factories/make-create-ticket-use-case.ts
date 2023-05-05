import { PrismaTicketsRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { CreateTicketUseCase } from '../create-ticket-use-case';

export function makeCreateTicketUseCase() {
  const ticketsRepository = new PrismaTicketsRepository();

  const useCase = new CreateTicketUseCase(ticketsRepository);

  return useCase;
}
