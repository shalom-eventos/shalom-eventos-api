import { EventTicket } from '@prisma/client';

import { TicketsRepository } from '../repositories/tickets-repository';

interface IRequest {
  event_id: string;
}

interface IResponse {
  tickets: EventTicket[];
}

export class ListTicketsByEventUseCase {
  constructor(private eventTicketsRepository: TicketsRepository) {}

  async execute({ event_id }: IRequest): Promise<IResponse> {
    const tickets = await this.eventTicketsRepository.findManyByEvent(event_id);

    return { tickets };
  }
}
