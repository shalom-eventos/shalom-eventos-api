import { AppError } from '@/shared/errors/app-error';

export class TicketNotFoundError extends AppError {
  constructor() {
    super('No valid ticket found.', 404);
  }
}
