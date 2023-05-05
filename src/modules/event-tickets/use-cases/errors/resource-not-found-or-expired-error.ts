import { AppError } from '@/shared/errors/AppError';

export class ResourceNotFoundOrExpiredError extends AppError {
  constructor() {
    super('Resource not found or Expired.', 404);
  }
}
