import { AppError } from '@/shared/errors/app-error';

export class UserAlreadyRegisteredError extends AppError {
  constructor() {
    super('User is already registered for this event', 409);
  }
}
