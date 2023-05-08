import { Prisma, EventRegistration } from '@prisma/client';

export interface RegistrationsRepository {
  findById(id: string): Promise<EventRegistration | null>;
  findByIdAndUser(
    id: string,
    user_id: string
  ): Promise<EventRegistration | null>;
  findManyByEvent(event_id: string): Promise<EventRegistration[]>;
  findManyByUser(user_id: string): Promise<EventRegistration[]>;
  create(
    data: Prisma.EventRegistrationUncheckedCreateInput
  ): Promise<EventRegistration>;
  save(data: EventRegistration): Promise<EventRegistration>;
}
