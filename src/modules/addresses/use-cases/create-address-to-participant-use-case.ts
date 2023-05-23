import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { AlreadyHasAddressError, ResourceNotFoundError } from './errors';
import { UsersRepository } from '@/modules/users/repositories/users-repository';
import { UserIsNotParticipantError } from './errors/user-is-not-participant-error';

interface IRequest {
  user_id: string;
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

export class CreateAddressToParticipantUseCase {
  constructor(
    private addressesRepository: AddressesRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
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

    if (userParticipant?.addresses && userParticipant.addresses.length > 0)
      throw new AlreadyHasAddressError();

    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
      district,
      city,
      state,
      users: {
        connect: {
          id: userParticipant.id,
        },
      },
    });

    return { address };
  }
}
