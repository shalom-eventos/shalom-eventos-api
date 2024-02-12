import { Address } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';

interface Request {
  eventId: string;
  addressId: string;
  street?: string;
  streetNumber?: string;
  complement?: string;
  zipCode?: string;
  district?: string;
  city?: string;
  state?: string;
}

interface Response {
  address: Address;
}

export class UpdateAddressToEventUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    )
  ) {}

  async execute({
    eventId,
    addressId,
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,
  }: Request): Promise<Response> {
    const address = await this.addressesRepository.findByEvent(
      addressId,
      eventId
    );

    if (!address) throw new ResourceNotFoundError('Address');

    if (street) address.street = street;
    if (streetNumber) address.streetNumber = streetNumber;
    if (complement) address.complement = complement;
    if (zipCode) address.zipCode = zipCode;
    if (district) address.district = district;
    if (city) address.city = city;
    if (state) address.state = state;

    await this.addressesRepository.save(address);

    return { address };
  }
}
