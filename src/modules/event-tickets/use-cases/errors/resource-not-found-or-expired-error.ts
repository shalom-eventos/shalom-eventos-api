import { AppError } from '@/shared/errors/app-error';

export class ResourceNotFoundOrExpiredError extends AppError {
  constructor() {
    super('Resource not found or Expired.', 404);
  }
}
