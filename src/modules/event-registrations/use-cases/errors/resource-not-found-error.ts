import { AppError } from '@/shared/errors/app-error';

export class ResourceNotFoundError extends AppError {
  constructor(resource?: string) {
    super(`${resource ?? 'Resource'} not found.`, 404);
  }
}
