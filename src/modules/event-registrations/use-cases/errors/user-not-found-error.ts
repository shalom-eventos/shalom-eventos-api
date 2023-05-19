import { AppError } from '@/shared/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found.', 404);
  }
}
