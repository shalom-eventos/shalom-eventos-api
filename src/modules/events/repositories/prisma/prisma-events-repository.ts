import { prisma } from '@/shared/lib/prisma';
import { Prisma, Event } from '@prisma/client';
import { EventsRepository } from './../events-repository';

export class PrismaEventsRepository implements EventsRepository {
  async findById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    return event;
  }

  async create(data: Prisma.EventCreateInput) {
    const event = await prisma.event.create({
      data,
    });

    return event;
  }

  async save(data: Event) {
    const event = await prisma.event.update({
      where: { id: data.id },
      data,
    });

    return event;
  }
}
