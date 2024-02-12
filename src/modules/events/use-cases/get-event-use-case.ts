import { Event } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { EventsRepository } from '../repositories/events-repository';

interface Request {
  id: string;
}

interface Response {
  event: Event;
}

export class GetEventUseCase {
  constructor(
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute({ id }: Request): Promise<Response> {
    const event = await this.eventsRepository.findById(id);

    if (!event) throw new ResourceNotFoundError();

    return { event };
  }
}
