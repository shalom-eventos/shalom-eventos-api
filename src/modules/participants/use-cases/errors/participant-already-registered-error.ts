import { AppError } from '@/shared/errors/app-error';

export class ParticipantAlreadyRegisteredError extends AppError {
  constructor() {
    super('Participant data is already registered for this user', 409);
  }
}
