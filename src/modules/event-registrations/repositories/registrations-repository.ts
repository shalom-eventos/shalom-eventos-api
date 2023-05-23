import { Prisma, EventRegistration } from '@prisma/client';
import { FindManyByEventResponse } from '../dtos/IFindManyByEventResponse';
import { FindManyByUserResponse } from '../dtos/IFindManyByUserResponse';

export interface RegistrationsRepository {
  findById(id: string): Promise<EventRegistration | null>;
  findByIdAndUser(
    id: string,
    user_id: string
  ): Promise<EventRegistration | null>;
  findByEventAndUser(
    event_id: string,
    user_id: string
  ): Promise<EventRegistration | null>;
  findManyByEvent(event_id: string): Promise<FindManyByEventResponse[]>;
  findManyByUser(user_id: string): Promise<FindManyByUserResponse[]>;
  create(
    data: Prisma.EventRegistrationUncheckedCreateInput
  ): Promise<EventRegistration>;
  save(data: EventRegistration): Promise<EventRegistration>;
}
