import { Prisma, Event } from '@prisma/client';
import { EventEntity } from '../entites/event-entity';

export interface EventsRepository {
  findById(id: string): Promise<EventEntity | null>;
  findBySlug(slug: string): Promise<EventEntity | null>;
  findMany(): Promise<EventEntity[]>;
  create(data: Prisma.EventCreateInput): Promise<EventEntity>;
  save(data: Event): Promise<EventEntity>;
  findByIdWithRelations(id: string): Promise<EventEntity | null>;
  findNextOne(): Promise<EventEntity | null>;
}
