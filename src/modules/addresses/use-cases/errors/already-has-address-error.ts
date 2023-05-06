import { AppError } from '@/shared/errors/app-error';

export class AlreadyHasAddressError extends AppError {
  constructor() {
    super('Resource already has a registered address', 409);
  }
}
