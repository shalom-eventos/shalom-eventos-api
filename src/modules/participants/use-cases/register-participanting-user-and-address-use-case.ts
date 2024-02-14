import {
  Address,
  Event,
  EventRegistration,
  EventTicket,
  Participant,
  Payment,
  Prisma,
} from '@prisma/client';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { AddressesRepository } from '@/modules/addresses/repositories/addresses-repository';
import { RegistrationsRepository } from '@/modules/event-registrations/repositories/registrations-repository';
import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { ResourceNotFoundError } from './errors';
import { AppError } from '@/shared/errors/app-error';
import { PaymentsRepository } from '@/modules/payments/repositories/payments-repository';
import { TicketsRepository } from '@/modules/event-tickets/repositories/tickets-repository';
import { TicketNotFoundError } from '@/modules/payments/use-cases/errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  street: string;
  streetNumber: string;
  complement?: string;
  zipCode: string;
  district: string;
  city: string;
  state: string;

  fullName: string;
  email: string;
  phoneNumber: string;
  birthdate: Date;
  documentNumber: string;
  documentType: string;
  guardianName?: string;
  guardianPhoneNumber?: string;
  prayerGroup?: string;
  communityType?: string;
  pcdDescription?: string;
  allergyDescription?: string;
  medicationUseDescription?: string;

  eventId: string;
  credentialName: string;
  eventSource?: string;
  transportationMode: string;
  acceptedTheTerms: boolean;
  type: string;
  hasParticipatedPreviously: boolean;

  paymentMethod: string;
  price: number;
  file: string;
}

interface Response {
  participant: Participant;
}

export class RegisterParticipantingUserAndAddressUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    ),
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    ),
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    ),
    private eventsRepository: EventsRepository = di.resolve('eventsRepository'),
    private paymentsRepository: PaymentsRepository = di.resolve(
      'paymentsRepository'
    ),
    private ticketsRepository: TicketsRepository = di.resolve(
      'ticketsRepository'
    )
  ) {}

  async execute({
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,

    fullName,
    email,
    phoneNumber,
    birthdate,
    documentNumber,
    documentType,
    guardianName,
    guardianPhoneNumber,
    prayerGroup,
    communityType,
    pcdDescription,
    allergyDescription,
    medicationUseDescription,

    eventId,
    eventSource,
    transportationMode,
    acceptedTheTerms,
    credentialName,
    hasParticipatedPreviously,
    type,

    paymentMethod,
    price,
    file,
  }: Request) {
    let event: Event | null;
    let participant: Participant;
    let address: Address;
    let registration: EventRegistration;
    let ticket: EventTicket | null;
    let payment: Payment;
    try {
      event = await this.eventsRepository.findById(eventId);
      if (!event) throw new ResourceNotFoundError('Event');

      const emailAlreadyRegisteredForThisEvent =
        await this.registrationsRepository.findOneByParticipantEmailAndEvent(
          email,
          eventId
        );
      if (emailAlreadyRegisteredForThisEvent)
        throw new AppError('Email already registered for this event', 409);

      /**
       * START - Create participant data
       */

      participant = await this.participantsRepository.create({
        fullName,
        email,
        phoneNumber,
        birthdate,
        documentNumber,
        documentType,
        guardianName,
        guardianPhoneNumber,
        prayerGroup,
        communityType,
        pcdDescription,
        allergyDescription,
        medicationUseDescription,
      });
      /**
       * END - Create participant data
       */

      /**
       * START - Create address
       */
      address = await this.addressesRepository.create({
        street,
        streetNumber,
        complement,
        zipCode,
        district,
        city,
        state,
        participants: {
          connect: {
            id: participant.id,
          },
        },
      });

      /**
       * END - Create address
       */

      /**
       * START - Create registration
       */
      registration = await this.registrationsRepository.create({
        participantId: participant.id,
        eventId,
        eventSource,
        transportationMode,
        acceptedTheTerms,
        credentialName,
        hasParticipatedPreviously,
        type,
      });
      /**
       * END - Create registration
       */

      /**
       * START - Create payment
       */
      ticket = await this.ticketsRepository.findFirstNotExpiredByEvent(
        registration.eventId
      );
      if (!ticket) throw new TicketNotFoundError();

      payment = await this.paymentsRepository.create({
        eventRegistrationId: registration.id,
        eventTicketId: ticket.id,
        paymentMethod,
        price: new Prisma.Decimal(price),
        file,
        status: 'sent',
      });
      /**
       * END - Create payment
       */

      return { participant };
    } catch (err) {
      if (registration) this.registrationsRepository.delete(registration.id);
      if (participant) this.participantsRepository.delete(participant.id);
      if (address) this.addressesRepository.delete(address.id);
      if (payment) this.paymentsRepository.delete(payment.id);
      throw err;
    }
  }
}
