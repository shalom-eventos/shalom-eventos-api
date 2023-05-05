import { AppError } from '@/shared/errors/AppError';

export class InvalidDateIntervalError extends AppError {
  constructor() {
    super('Invalid date interval.', 403);
  }
}
