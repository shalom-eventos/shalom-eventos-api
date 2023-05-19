import { Payment, Prisma } from '@prisma/client';

import { TicketsRepository } from '@/modules/event-tickets/repositories/tickets-repository';
import { PaymentsRepository } from '../repositories/payments-repository';
import { RegistrationsRepository } from '@/modules/event-registrations/repositories/registrations-repository';
import { RegistrationNotFoundError, TicketNotFoundError } from './errors';

interface IRequest {
  user_id: string;
  event_registration_id: string;
  payment_method: string;
  price: number;
  file: string;
}

interface IResponse {
  payment: Payment;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private registrationsRepository: RegistrationsRepository,
    private ticketsRepository: TicketsRepository
  ) {}

  async execute({
    user_id,
    event_registration_id,
    payment_method,
    price,
    file,
  }: IRequest): Promise<IResponse> {
    const registration = await this.registrationsRepository.findByIdAndUser(
      event_registration_id,
      user_id
    );
    if (!registration) throw new RegistrationNotFoundError();

    const ticket = await this.ticketsRepository.findFirstNotExpiredByEvent(
      registration.event_id
    );
    if (!ticket) throw new TicketNotFoundError();

    const payment = await this.paymentsRepository.create({
      event_registration_id,
      event_ticket_id: ticket.id,
      payment_method,
      price: new Prisma.Decimal(price),
      file,
      status: 'sent',
    });

    return { payment };
  }
}
