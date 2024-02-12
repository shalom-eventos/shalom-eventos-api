import { RegistrationsRepository } from '../repositories/registrations-repository';
import { FindManyByEventResponseDto } from '../dtos/find-many-by-event-response-dto';
import { di } from '@/shared/lib/diContainer';

interface Request {
  eventId: string;
}

interface Response {
  registrations: FindManyByEventResponseDto[];
}

export class ListRegistrationsByEventUseCase {
  constructor(
    private registrationsRepository: RegistrationsRepository = di.resolve(
      'registrationsRepository'
    )
  ) {}

  async execute({ eventId }: Request): Promise<Response> {
    const registrations = await this.registrationsRepository.findManyByEvent(
      eventId
    );

    return { registrations };
  }
}
