import { AppError } from '@/shared/errors/app-error';

export class ResourceNotFoundError extends AppError {
  constructor() {
    super('Resource not found.', 404);
  }
}
