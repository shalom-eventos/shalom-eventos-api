import { AppError } from '@/shared/errors/app-error';

export class UserNotAuthorizedError extends AppError {
  constructor() {
    super('User not authorized to perform this action.', 401);
  }
}
