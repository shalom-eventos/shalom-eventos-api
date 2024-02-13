import { AppError } from '@/shared/errors/app-error';

export class PaymentNotFoundError extends AppError {
  constructor() {
    super('Payment not found.', 404);
  }
}
