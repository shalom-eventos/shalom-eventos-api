import { di } from '@/shared/lib/diContainer';
import { ResourceNotFoundError } from './errors';
import { RegistrationsRepository } from '../repositories/registrations-repository';
import { DeletePaymentUseCase } from '@/modules/payments/use-cases/delete-payment-use-case';
import { DeleteParticipantUseCase } from '@/modules/participants/use-cases/delete-participant-use-case';

interface Request {
  userLoggedId: string;
  registrationId: string;
}

export class DeleteRegistrationUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    ),
    private deletePaymentUseCase = new DeletePaymentUseCase(),
    private deleteParticipantUseCase = new DeleteParticipantUseCase()
  ) {}

  async execute({ userLoggedId, registrationId }: Request): Promise<void> {
    const registration = await this.registrationsRepository.findOneById(
      registrationId
    );
    if (!registration) throw new ResourceNotFoundError('Registration');

    await this.deletePaymentUseCase.execute({
      eventRegistrationId: registrationId,
    });

    await this.registrationsRepository.delete(registrationId);

    await this.deleteParticipantUseCase.execute({
      userLoggedId,
      participantId: registration.participantId,
      preventIfExistsUser: true,
    });

    return;
  }
}
