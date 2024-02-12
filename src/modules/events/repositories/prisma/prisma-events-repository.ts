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
  async findBySlug(slug: string) {
    const event = await prisma.event.findUnique({
      where: { slug },
    });

    return event;
  }

  async findMany() {
    const events = await prisma.event.findMany({});

    return events;
  }

  async findByIdWithRelations(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { addresses: true },
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
    const { id, createdAt, updatedAt, ...dataUpdated } = data;
    const event = await prisma.event.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return event;
  }

  async findNextOne() {
    const event = await prisma.event.findFirst({
      where: { startDate: { gte: new Date() } },
      include: {
        tickets: {
          where: {
            expiresAt: { gt: new Date() },
          },
        },
      },
    });
    return event;
  }
}
