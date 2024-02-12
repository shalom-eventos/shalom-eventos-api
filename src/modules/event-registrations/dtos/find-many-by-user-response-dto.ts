import {
  EventRegistration,
  Payment,
  Participant,
  Address,
  Event,
} from '@prisma/client';

export type FindManyByUserResponseDto = EventRegistration & {
  payment: Payment | null;
  participant: {
    user: {
      email: string;
      addresses: Address[];
    } | null;
  };
  event: Event & {
    addresses: Address[];
  };
};
