import { EventTicket } from '@prisma/client';

import { TicketsRepository } from '../repositories/tickets-repository';
import { di } from '@/shared/lib/diContainer';

interface Request {
  eventId: string;
}

interface Response {
  tickets: EventTicket[];
}

export class ListTicketsByEventUseCase {
  constructor(
    private eventTicketsRepository: TicketsRepository = di.resolve(
      'ticketsRepository'
    )
  ) {}

  async execute({ eventId }: Request): Promise<Response> {
    const tickets = await this.eventTicketsRepository.findManyByEvent(eventId);

    return { tickets };
  }
}
