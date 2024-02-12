import {
  EventRegistration,
  Payment,
  Participant,
  Event,
  Address,
} from '@prisma/client';

export type FindManyByEventResponseDto = EventRegistration & {
  payment: Payment | null;
  participant: Participant & {
    addresses: Address[];
    user: {
      email: string;
      addresses: Address[];
    } | null;
  };
  event: Event & {
    addresses: Address[];
  };
};
