import dayjs from 'dayjs';
import { Event } from '@prisma/client';

import { generateSlug } from '@/shared/utils/generate-slug';
import { EventsRepository } from '../repositories/events-repository';
import { InvalidDateIntervalError } from './errors/invalid-date-interval-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { SlugExistsError } from './errors/slug-exists-error';

interface IRequest {
  slug?: string;
  title?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
}

interface IResponse {
  event: Event;
}

export class UpdateEventUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute(
    id: string,
    { slug, title, description, start_date, end_date }: IRequest
  ): Promise<IResponse> {
    const event = await this.eventsRepository.findById(id);

    if (!event) throw new ResourceNotFoundError();

    if (title) event.title = title;
    if (description) event.description = description;

    if (start_date && end_date) {
      if (dayjs(start_date).isAfter(end_date))
        throw new InvalidDateIntervalError();
    }

    if (start_date) {
      if (dayjs(start_date).isAfter(event.end_date))
        throw new InvalidDateIntervalError();
      event.start_date = start_date;
    }

    if (end_date) {
      if (dayjs(end_date).isBefore(event.start_date))
        throw new InvalidDateIntervalError();
      event.end_date = end_date;
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
