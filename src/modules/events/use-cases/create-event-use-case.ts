import dayjs from 'dayjs';
import { Event } from '@prisma/client';

import { EventsRepository } from '../repositories/events-repository';
import { InvalidDateIntervalError } from './errors/invalid-date-interval-error';
import { generateSlug } from '@/shared/utils/generate-slug';
import { di } from '@/shared/lib/diContainer';

interface Request {
  title: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
}

interface Response {
  event: Event;
}

export class CreateEventUseCase {
  constructor(
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute({
    title,
    description,
    start_date,
    end_date,
  }: Request): Promise<Response> {
    const endDate = end_date
      ? end_date
      : dayjs(start_date).endOf('date').toDate();

    if (dayjs(start_date).isAfter(end_date))
      throw new InvalidDateIntervalError();

    let slug = generateSlug({ keyword: title });

    for (let i = 1; i < 1000; i++) {
      const slugExists = await this.eventsRepository.findBySlug(slug);
      if (slugExists) {
        slug = generateSlug({
          keyword: title,
          withHash: true,
          hash: String(i),
        });
      } else {
        break;
      }
    }

    const event = await this.eventsRepository.create({
      slug,
      title,
      description,
      start_date,
      end_date: endDate,
    });

    return { event };
  }
}
