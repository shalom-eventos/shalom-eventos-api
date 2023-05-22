import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  event_id: string;
  address_id: string;
  street?: string;
  street_number?: string;
  complement?: string;
  zip_code?: string;
  district?: string;
  city?: string;
  state?: string;
}

interface IResponse {
  address: Address;
}

export class UpdateAddressToEventUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({
    event_id,
    address_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
  }: IRequest): Promise<IResponse> {
    const address = await this.addressesRepository.findByEvent(
      address_id,
      event_id
    );

    if (!address) throw new ResourceNotFoundError('Address');

    if (street) address.street = street;
    if (street_number) address.street_number = street_number;
    if (complement) address.complement = complement;
    if (zip_code) address.zip_code = zip_code;
    if (district) address.district = district;
    if (city) address.city = city;
    if (state) address.state = state;

    await this.addressesRepository.save(address);

    return { address };
  }
}
