import { Event } from '@prisma/client';

import { EventsRepository } from '../repositories/events-repository';

interface IRequest {}

interface IResponse {
  events: Event[];
}

export class ListEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute(): Promise<IResponse> {
    const events = await this.eventsRepository.findMany();

    return { events };
  }
}
