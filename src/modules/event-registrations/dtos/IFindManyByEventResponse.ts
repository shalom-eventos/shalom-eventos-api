import {
  EventRegistration,
  Payment,
  Participant,
  Event,
  Address,
} from '@prisma/client';

export type FindManyByEventResponse = EventRegistration & {
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
