import dayjs from 'dayjs';
import { Event } from '@prisma/client';

import { EventsRepository } from '../repositories/events-repository';
import { InvalidDateIntervalError } from './errors/invalid-date-interval-error';
import { generateSlug } from '@/shared/utils/generate-slug';
import { di } from '@/shared/lib/diContainer';

interface Request {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
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
    startDate,
    endDate,
  }: Request): Promise<Response> {
    const finalEndDate = endDate
      ? endDate
      : dayjs(startDate).endOf('date').toDate();

    if (dayjs(startDate).isAfter(finalEndDate))
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
      startDate,
      endDate,
    });

    return { event };
  }
}
