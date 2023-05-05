import { AppError } from '@/shared/errors/AppError';

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('E-mail already exists.', 409);
  }
}
