import { EventTicket } from '@prisma/client';
import dayjs from 'dayjs';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { TicketsRepository } from '../repositories/tickets-repository';
import {
  EventNotFoundError,
  ExpiresInCannotBeAfterEventEndDateError,
} from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  eventId: string;
  title: string;
  price: number;
  startsAt?: Date;
  expiresAt?: Date;
}

interface Response {
  ticket: EventTicket;
}

export class CreateTicketUseCase {
  constructor(
    private ticketsRepository: TicketsRepository = di.resolve(
      'ticketsRepository'
    ),
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute({
    eventId,
    title,
    price,
    startsAt,
    expiresAt,
  }: Request): Promise<Response> {
    const eventExists = await this.eventsRepository.findById(eventId);
    if (!eventExists) throw new EventNotFoundError();

    if (dayjs(expiresAt).isAfter(eventExists.endDate))
      throw new ExpiresInCannotBeAfterEventEndDateError();

    const ticket = await this.ticketsRepository.create({
      eventId,
      title,
      price,
      startsAt,
      expiresAt,
    });

    return { ticket };
  }
}
