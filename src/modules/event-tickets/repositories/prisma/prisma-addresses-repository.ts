import { prisma } from '@/shared/lib/prisma';
import { Prisma, EventTicket } from '@prisma/client';

import { TicketsRepository } from './../tickets-repository';

export class PrismaTicketsRepository implements TicketsRepository {
  async findById(id: string) {
    const ticket = await prisma.eventTicket.findUnique({
      where: { id },
    });

    return ticket;
  }

  async findByIdIfEventNotExpired(id: string) {
    const ticket = await prisma.eventTicket.findFirst({
      where: {
        id,
        event: {
          end_date: {
            gt: new Date(),
          },
        },
      },
    });

    return ticket;
  }

  async findFirstNotExpiredByEvent(
    event_id: string
  ): Promise<EventTicket | null> {
    const ticket = await prisma.eventTicket.findFirst({
      where: {
        event_id,
        expires_in: { gt: new Date() },
      },
    });

    return ticket;
  }

  async findManyByEvent(event_id: string) {
    const ticket = await prisma.eventTicket.findMany({
      where: { event_id },
    });

    return ticket;
  }

  async create(data: Prisma.EventTicketUncheckedCreateInput) {
    const ticket = await prisma.eventTicket.create({
      data,
    });

    return ticket;
  }

  async save(data: EventTicket) {
    const ticket = await prisma.eventTicket.update({
      where: { id: data.id },
      data,
    });

    return ticket;
  }
}
