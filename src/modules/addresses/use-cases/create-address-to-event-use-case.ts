import { Address } from '@prisma/client';

import { EventsRepository } from '@/modules/events/repositories/events-repository';
import { AddressesRepository } from '../repositories/addresses-repository';
import { AlreadyHasAddressError, ResourceNotFoundError } from './errors';

interface IRequest {
  event_id: string;
  street: string;
  street_number: string;
  complement?: string;
  zip_code: string;
  district: string;
  city: string;
  state: string;
}

interface IResponse {
  address: Address;
}

export class CreateAddressToEventUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private eventsRepository: EventsRepository
  ) {}

  async execute({
    event_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
  }: IRequest): Promise<IResponse> {
    const event = await this.eventsRepository.findByIdWithRelations(event_id);

    if (!event) throw new ResourceNotFoundError('User');

    if (event?.addresses && event.addresses.length > 0)
      throw new AlreadyHasAddressError();

    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
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
