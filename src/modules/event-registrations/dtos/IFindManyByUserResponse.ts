import {
  EventRegistration,
  Payment,
  Participant,
  Address,
  Event,
} from '@prisma/client';

export type FindManyByUserResponse = EventRegistration & {
  payment: Payment | null;
  user: { email: string; participant: Participant | null };
  event: Event & {
    addresses: Address[];
  };
};
