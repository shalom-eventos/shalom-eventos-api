import { AppError } from '@/shared/errors/app-error';

export class InvalidDateIntervalError extends AppError {
  constructor() {
    super('Invalid date interval.', 403);
  }
}
