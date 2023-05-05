import dayjs from 'dayjs';
import { Event } from '@prisma/client';

import { EventsRepository } from '../repositories/events-repository';
import { InvalidDateIntervalError } from './errors/invalid-date-interval-error';

interface IRequest {
  title: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
}

interface IResponse {
  event: Event;
}

export class CreateEventUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    title,
    description,
    start_date,
    end_date,
  }: IRequest): Promise<IResponse> {
    const endDate = end_date
      ? end_date
      : dayjs(start_date).endOf('date').toDate();

    if (dayjs(start_date).isAfter(end_date))
      throw new InvalidDateIntervalError();

    const event = await this.eventsRepository.create({
      title,
      description,
      start_date,
      end_date: endDate,
    });

    return { event };
  }
}
