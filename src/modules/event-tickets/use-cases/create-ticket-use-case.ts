import { EventTicket } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { TicketsRepository } from '../repositories/tickets-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  event_id: string;
  title: string;
  price: number;
  expires_in?: Date;
}

interface IResponse {
  ticket: EventTicket;
}

export class CreateTicketUseCase {
  constructor(
    private ticketsRepository: TicketsRepository,
    private eventsRepository: EventsRepository
  ) {}

  async execute({
    event_id,
    title,
    price,
    expires_in,
  }: IRequest): Promise<IResponse> {
    const eventExists = await this.eventsRepository.findById(event_id);
    if (!eventExists) throw new ResourceNotFoundError();

    const ticket = await this.ticketsRepository.create({
      event_id,
      title,
      price,
      expires_in,
    });

    if (!ticket) throw new ResourceNotFoundError();

    return { ticket };
  }
}
