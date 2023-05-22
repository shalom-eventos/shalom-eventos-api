import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';
import { UsersRepository } from '@/modules/users/repositories/users-repository';
import { UserIsNotParticipantError } from './errors/user-is-not-participant-error';

interface IRequest {
  address_id: string;
  user_id: string;
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

export class UpdateAddressToParticipantUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    address_id,
    user_id,
    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,
  }: IRequest): Promise<IResponse> {
    const userParticipant = await this.usersRepository.findByIdWithRelations(
      user_id
    );

    if (!userParticipant) throw new ResourceNotFoundError('User');

    if (userParticipant.role !== 'PARTICIPANT')
      throw new UserIsNotParticipantError();

    if (userParticipant?.addresses && userParticipant.addresses.length === 0)
      throw new ResourceNotFoundError('Address');

    const address = userParticipant.addresses.find(
      (address) => address.id === address_id
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
