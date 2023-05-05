import { AppError } from '@/shared/errors/AppError';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials.', 401);
  }
}
