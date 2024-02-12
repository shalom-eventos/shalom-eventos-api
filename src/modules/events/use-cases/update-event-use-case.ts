import dayjs from 'dayjs';
import { Event } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { generateSlug } from '@/shared/utils/generate-slug';
import { EventsRepository } from '../repositories/events-repository';
import { InvalidDateIntervalError } from './errors/invalid-date-interval-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { SlugExistsError } from './errors/slug-exists-error';

interface Request {
  slug?: string;
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

interface Response {
  event: Event;
}

export class UpdateEventUseCase {
  constructor(
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute(
    id: string,
    { slug, title, description, startDate, endDate }: Request
  ): Promise<Response> {
    const event = await this.eventsRepository.findById(id);

    if (!event) throw new ResourceNotFoundError();

    if (title) event.title = title;
    if (description) event.description = description;

    if (startDate && endDate) {
      if (dayjs(startDate).isAfter(endDate))
        throw new InvalidDateIntervalError();
    }

    if (startDate) {
      if (dayjs(startDate).isAfter(event.endDate))
        throw new InvalidDateIntervalError();
      event.startDate = startDate;
    }

    if (endDate) {
      if (dayjs(endDate).isBefore(event.startDate))
        throw new InvalidDateIntervalError();
      event.endDate = endDate;
    }

    if (slug) {
      const slugHashed = generateSlug({ keyword: slug });
      const slugExists = await this.eventsRepository.findBySlug(slugHashed);
      if (slugExists && slugHashed !== event.slug) throw new SlugExistsError();

      event.slug = slugHashed;
    }

    await this.eventsRepository.save(event);

    return { event };
  }
}
