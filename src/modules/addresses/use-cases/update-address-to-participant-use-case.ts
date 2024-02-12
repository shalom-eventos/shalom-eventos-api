import { Address } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { UsersRepository } from '@/modules/users/repositories/users-repository';
import { UserIsNotParticipantError } from './errors/user-is-not-participant-error';
import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';

interface Request {
  addressId: string;
  userId: string;
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

export class UpdateAddressToParticipantUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    ),
    private usersRepository: UsersRepository = di.resolve('usersRepository')
  ) {}

  async execute({
    addressId,
    userId,
    street,
    streetNumber,
    complement,
    zipCode,
    district,
    city,
    state,
  }: Request): Promise<Response> {
    const userParticipant = await this.usersRepository.findByIdWithRelations(
      userId
    );

    if (!userParticipant) throw new ResourceNotFoundError('User');

    if (userParticipant.role !== 'PARTICIPANT')
      throw new UserIsNotParticipantError();

    if (userParticipant?.addresses && userParticipant.addresses.length === 0)
      throw new ResourceNotFoundError('Address');

    const address = userParticipant.addresses.find(
      (address) => address.id === addressId
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
