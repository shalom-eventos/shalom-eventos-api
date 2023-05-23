import { AppError } from '@/shared/errors/app-error';

export class SlugExistsError extends AppError {
  constructor() {
    super('Slug already exists.', 409);
  }
}
