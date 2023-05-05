import { AppError } from '@/shared/errors/AppError';

export class AlreadyHasAddressError extends AppError {
  constructor() {
    super('Resource already has a registered address', 409);
  }
}
