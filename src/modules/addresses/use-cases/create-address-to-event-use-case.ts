import { Address } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { AddressesRepository } from '../repositories/addresses-repository';
import { AlreadyHasAddressError, ResourceNotFoundError } from './errors';

interface Request {
  eventId: string;
  street: string;
  streetNumber: string;
  complement?: string;
  zipCode: string;
  district: string;
  city: string;
  state: string;
}

interface Response {
  address: Address;
}

export class CreateAddressToEventUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    ),
    private eventsRepository: EventsRepository = di.resolve('eventsRepository')
  ) {}

  async execute({
    eventId,
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,
  }: Request): Promise<Response> {
    const event = await this.eventsRepository.findByIdWithRelations(eventId);

    if (!event) throw new ResourceNotFoundError('User');

    if (event?.addresses && event.addresses.length > 0)
      throw new AlreadyHasAddressError();

    const address = await this.addressesRepository.create({
      street,
      streetNumber,
      complement,
      zipCode,
      district,
      city,
      state,
      events: {
        connect: {
          id: event.id,
        },
      },
    });

    return { address };
  }
}
