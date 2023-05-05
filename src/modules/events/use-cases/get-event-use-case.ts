import { Event } from '@prisma/client';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { EventsRepository } from '../repositories/events-repository';

interface IRequest {
  id: string;
}

interface IResponse {
  event: Event;
}

export class GetEventUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const event = await this.eventsRepository.findById(id);

    if (!event) throw new ResourceNotFoundError();

    return { event };
  }
}
