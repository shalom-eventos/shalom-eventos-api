import { prisma } from '@/shared/lib/prisma';
import { Prisma, Event, Address } from '@prisma/client';
import { EventsRepository } from './../events-repository';
import { EventEntity } from '../../entites/event-entity';

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

  async save(data: EventEntity) {
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const event = await prisma.event.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return event;
  }
}
