import { Event } from '@prisma/client';

import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { EventsRepository } from '../repositories/events-repository';
import { di } from '@/shared/lib/diContainer';

interface Request {}

interface Response {
  event: Event;
}

export class GetNextEventUseCase {
  constructor(
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute(): Promise<Response> {
    const event = await this.eventsRepository.findNextOne();

    if (!event) throw new ResourceNotFoundError();

    return { event };
  }
}
