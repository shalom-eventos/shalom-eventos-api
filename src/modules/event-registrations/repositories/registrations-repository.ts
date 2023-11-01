import { Prisma, EventRegistration } from '@prisma/client';
import { FindManyByEventResponse } from '../dtos/IFindManyByEventResponse';
import { FindManyByUserResponse } from '../dtos/IFindManyByUserResponse';

export interface RegistrationsRepository {
  create(
    data: Prisma.EventRegistrationUncheckedCreateInput
  ): Promise<EventRegistration>;
  save(data: EventRegistration): Promise<EventRegistration>;
  findOneById(id: string): Promise<EventRegistration | null>;
  findOneByIdAndUser(
    id: string,
    user_id: string
  ): Promise<EventRegistration | null>;
  findOneByEventAndUser(
    event_id: string,
    user_id: string
  ): Promise<EventRegistration | null>;
  findManyByEvent(event_id: string): Promise<FindManyByEventResponse[]>;
  findManyByUser(user_id: string): Promise<FindManyByUserResponse[]>;
  findOneByParticipantEmail(email: string): Promise<EventRegistration | null>;
  delete(id: string): Promise<void>;
}
