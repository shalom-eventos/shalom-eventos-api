import { Prisma, EventRegistration } from '@prisma/client';
import { FindManyByEventResponseDto } from '../dtos/find-many-by-event-response-dto';
import { FindManyByUserResponseDto } from '../dtos/find-many-by-user-response-dto';
import { FilterRegistrationsDto } from '../dtos/filter-registrations-dto';

export interface RegistrationsRepository {
  create(
    data: Prisma.EventRegistrationUncheckedCreateInput
  ): Promise<EventRegistration>;
  save(data: EventRegistration): Promise<EventRegistration>;
  findOneById(id: string): Promise<EventRegistration | null>;
  findOneByIdAndUser(
    id: string,
    userId: string
  ): Promise<EventRegistration | null>;
  findOneByEventAndUser(
    eventId: string,
    userId: string
  ): Promise<EventRegistration | null>;
  findManyByEvent(
    eventId: string,
    filter?: FilterRegistrationsDto
  ): Promise<FindManyByEventResponseDto[]>;
  findManyByUser(userId: string): Promise<FindManyByUserResponseDto[]>;
  findOneByParticipantEmailAndEvent(
    email: string,
    eventId: string
  ): Promise<EventRegistration | null>;
  delete(id: string): Promise<void>;
}
