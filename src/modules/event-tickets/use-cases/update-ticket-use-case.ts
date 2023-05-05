import { EventTicket, Prisma } from '@prisma/client';

import { TicketsRepository } from '../repositories/tickets-repository';
import { ResourceNotFoundOrExpiredError } from './errors';

interface IRequest {
  title?: string;
  price?: number;
  expires_in?: Date;
}

interface IResponse {
  ticket: EventTicket;
}

export class UpdateEventTicketUseCase {
  constructor(private ticketsRepository: TicketsRepository) {}

  async execute(
    id: string,
    { title, price, expires_in }: IRequest
  ): Promise<IResponse> {
    const ticket = await this.ticketsRepository.findByIdIfEventNotExpired(id);

    if (!ticket) throw new ResourceNotFoundOrExpiredError();

    if (title) ticket.title = title;
    if (price) ticket.price = new Prisma.Decimal(price);
    if (expires_in) ticket.expires_in = expires_in;

    await this.ticketsRepository.save(ticket);

    return { ticket };
  }
}
