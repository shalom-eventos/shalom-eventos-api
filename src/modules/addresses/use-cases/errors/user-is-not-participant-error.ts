import { AppError } from '@/shared/errors/app-error';

export class UserIsNotParticipantError extends AppError {
  constructor() {
    super('User is not participant.', 403);
  }
}
