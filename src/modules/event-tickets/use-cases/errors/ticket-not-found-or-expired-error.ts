import { AppError } from '@/shared/errors/app-error';

export class TicketNotFoundOrExpiredError extends AppError {
  constructor() {
    super('Ticket not found or Expired.', 404);
  }
}
