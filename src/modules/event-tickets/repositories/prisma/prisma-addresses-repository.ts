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
          endDate: {
            gt: new Date(),
          },
        },
      },
    });

    return ticket;
  }

  async findFirstNotExpiredByEvent(
    eventId: string
  ): Promise<EventTicket | null> {
    const ticket = await prisma.eventTicket.findFirst({
      where: {
        eventId,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        startsAt: 'asc',
        expiresAt: 'asc',
        createdAt: 'asc',
      },
    });

    return ticket;
  }

  async findManyByEvent(eventId: string) {
    const ticket = await prisma.eventTicket.findMany({
      where: { eventId },
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
    const { id, createdAt, updatedAt, ...dataUpdated } = data;
    const ticket = await prisma.eventTicket.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return ticket;
  }

  async delete(id: string) {
    await prisma.eventTicket.delete({ where: { id } });
    return;
  }
}
