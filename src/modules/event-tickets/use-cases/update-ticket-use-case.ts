import { EventTicket, Prisma } from '@prisma/client';

import { TicketsRepository } from '../repositories/tickets-repository';
import { TicketNotFoundOrExpiredError } from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  title?: string;
  price?: number;
  startsAt?: Date;
  expiresAt?: Date;
}

interface Response {
  ticket: EventTicket;
}

export class UpdateEventTicketUseCase {
  constructor(
    private ticketsRepository: TicketsRepository = di.resolve(
      'ticketsRepository'
    )
  ) {}

  async execute(
    id: string,
    { title, price, startsAt, expiresAt }: Request
  ): Promise<Response> {
    const ticket = await this.ticketsRepository.findByIdIfEventNotExpired(id);

    if (!ticket) throw new TicketNotFoundOrExpiredError();

    if (title) ticket.title = title;
    if (price) ticket.price = new Prisma.Decimal(price);
    if (expiresAt) ticket.expiresAt = expiresAt;
    if (startsAt) ticket.startsAt = startsAt;

    await this.ticketsRepository.save(ticket);

    return { ticket };
  }
}
