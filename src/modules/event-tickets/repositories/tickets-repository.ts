import { Prisma, EventTicket } from '@prisma/client';

export interface TicketsRepository {
  findById(id: string): Promise<EventTicket | null>;
  findManyByEvent(event_id: string): Promise<EventTicket[]>;
  create(data: Prisma.EventTicketUncheckedCreateInput): Promise<EventTicket>;
  save(data: EventTicket): Promise<EventTicket>;
  findByIdIfEventNotExpired(id: string): Promise<EventTicket | null>;
  findFirstNotExpiredByEvent(event_id: string): Promise<EventTicket | null>;
}
