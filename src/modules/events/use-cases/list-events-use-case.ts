import { Event } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { EventsRepository } from '../repositories/events-repository';

interface Request {}

interface Response {
  events: Event[];
}

export class ListEventsUseCase {
  constructor(
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute(): Promise<Response> {
    const events = await this.eventsRepository.findMany();

    return { events };
  }
}
