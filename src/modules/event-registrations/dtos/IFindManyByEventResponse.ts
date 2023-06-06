import {
  EventRegistration,
  Payment,
  Participant,
  Event,
  Address,
} from '@prisma/client';

export type FindManyByEventResponse = EventRegistration & {
  payment: Payment | null;
  user: {
    email: string;
    participant: Participant | null;
    addresses: Address[];
  };
  event: Event & {
    addresses: Address[];
  };
};
