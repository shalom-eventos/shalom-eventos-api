import {
  EventRegistration,
  Payment,
  Participant,
  Event,
  Address,
  EventTicket,
} from '@prisma/client';

export type FindManyByEventResponseDto = EventRegistration & {
  payment:
    | null
    | (Payment & {
        tickets: EventTicket;
      });
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
