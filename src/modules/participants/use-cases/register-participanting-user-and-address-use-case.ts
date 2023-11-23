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

interface IRequest {
  street: string;
  street_number: string;
  complement?: string;
  zip_code: string;
  district: string;
  city: string;
  state: string;

  full_name: string;
  email: string;
  phone_number: string;
  birthdate: Date;
  document_number: string;
  document_type: string;
  guardian_name?: string;
  guardian_phone_number?: string;
  prayer_group?: string;
  community_type?: string;
  pcd_description?: string;
  allergy_description?: string;
  medication_use_description?: string;

  event_id: string;
  credential_name: string;
  event_source?: string;
  transportation_mode: string;
  accepted_the_terms: boolean;
  type: string;
  has_participated_previously: boolean;

  payment_method: string;
  price: number;
  file: string;
}

interface IResponse {
  participant: Participant;
}

export class RegisterParticipantingUserAndAddressUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private addressesRepository: AddressesRepository,
    private registrationsRepository: RegistrationsRepository,
    private eventsRepository: EventsRepository,
    private paymentsRepository: PaymentsRepository,
    private ticketsRepository: TicketsRepository
  ) {}

  async execute({
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,

    full_name,
    email,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description,
    medication_use_description,

    event_id,
    event_source,
    transportation_mode,
    accepted_the_terms,
    credential_name,
    has_participated_previously,
    type,

    payment_method,
    price,
    file,
  }: IRequest) {
    let event: Event | null;
    let participant: Participant;
    let address: Address;
    let registration: EventRegistration;
    let ticket: EventTicket | null;
    let payment: Payment;
    try {
      event = await this.eventsRepository.findById(event_id);
      if (!event) throw new ResourceNotFoundError('Event');

      const emailAlreadyRegisteredForThisEvent =
        await this.registrationsRepository.findOneByParticipantEmail(email);
      if (emailAlreadyRegisteredForThisEvent)
        throw new AppError('Email already registered for this event', 409);

      /**
       * START - Create participant data
       */

      participant = await this.participantsRepository.create({
        full_name,
        email,
        phone_number,
        birthdate,
        document_number,
        document_type,
        guardian_name,
        guardian_phone_number,
        prayer_group,
        community_type,
        pcd_description,
        allergy_description,
        medication_use_description,
      });
      /**
       * END - Create participant data
       */

      /**
       * START - Create address
       */
      address = await this.addressesRepository.create({
        street,
        street_number,
        complement,
        zip_code,
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
        participant_id: participant.id,
        event_id,
        event_source,
        transportation_mode,
        accepted_the_terms,
        credential_name,
        has_participated_previously,
        type,
      });
      /**
       * END - Create registration
       */

      /**
       * START - Create payment
       */
      ticket = await this.ticketsRepository.findFirstNotExpiredByEvent(
        registration.event_id
      );
      if (!ticket) throw new TicketNotFoundError();

      payment = await this.paymentsRepository.create({
        event_registration_id: registration.id,
        event_ticket_id: ticket.id,
        payment_method,
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
