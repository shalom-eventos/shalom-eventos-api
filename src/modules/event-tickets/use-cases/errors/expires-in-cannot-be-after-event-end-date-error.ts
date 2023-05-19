import { AppError } from '@/shared/errors/app-error';

export class ExpiresInCannotBeAfterEventEndDateError extends AppError {
  constructor() {
    super('Expires In cannot be after event end date.', 403);
  }
}
