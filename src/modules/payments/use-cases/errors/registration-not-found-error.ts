import { AppError } from '@/shared/errors/app-error';

export class RegistrationNotFoundError extends AppError {
  constructor() {
    super('Registration not found.', 404);
  }
}
