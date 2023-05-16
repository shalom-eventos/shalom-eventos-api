import { AppError } from '@/shared/errors/app-error';

export class EventNotFoundError extends AppError {
  constructor() {
    super('Event not found.', 404);
  }
}
