import { Prisma, Event, Address } from '@prisma/client';

type EventWithRelationsType = Event & {
  addresses: Address[];
};

export interface EventsRepository {
  findById(id: string): Promise<Event | null>;
  create(data: Prisma.EventCreateInput): Promise<Event>;
  save(data: Event): Promise<Event>;
  findByIdWithRelations(id: string): Promise<EventWithRelationsType | null>;
}
