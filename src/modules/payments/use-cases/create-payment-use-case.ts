import { Payment, Prisma } from '@prisma/client';

import { TicketsRepository } from '@/modules/event-tickets/repositories/tickets-repository';
import { PaymentsRepository } from '../repositories/payments-repository';
import { RegistrationsRepository } from '@/modules/event-registrations/repositories/registrations-repository';
import { RegistrationNotFoundError, TicketNotFoundError } from './errors';

interface Request {
  userId: string;
  eventRegistrationId: string;
  paymentMethod: string;
  price: number;
  file: string;
}

interface Response {
  payment: Payment;
}

export class CreatePaymentUseCase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private registrationsRepository: RegistrationsRepository,
    private ticketsRepository: TicketsRepository
  ) {}

  async execute({
    userId,
    eventRegistrationId,
    paymentMethod,
    price,
    file,
  }: Request): Promise<Response> {
    const registration = await this.registrationsRepository.findOneByIdAndUser(
      eventRegistrationId,
      userId
    );
    if (!registration) throw new RegistrationNotFoundError();

    const ticket = await this.ticketsRepository.findFirstNotExpiredByEvent(
      registration.eventId
    );
    if (!ticket) throw new TicketNotFoundError();

    const payment = await this.paymentsRepository.create({
      eventRegistrationId,
      eventTicketId: ticket.id,
      paymentMethod,
      price: new Prisma.Decimal(price),
      file,
      status: 'sent',
    });

    return { payment };
  }
}
