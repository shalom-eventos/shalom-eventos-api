import { Address } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { UsersRepository } from '@/modules/users/repositories/users-repository';
import { AddressesRepository } from '../repositories/addresses-repository';
import { AlreadyHasAddressError, ResourceNotFoundError } from './errors';
import { UserIsNotParticipantError } from './errors/user-is-not-participant-error';

interface Request {
  userId: string;
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

export class CreateAddressToParticipantUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    ),
    private usersRepository: UsersRepository = di.resolve('usersRepository')
  ) {}

  async execute({
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

    if (userParticipant?.addresses && userParticipant.addresses.length > 0)
      throw new AlreadyHasAddressError();

    const address = await this.addressesRepository.create({
      street,
      streetNumber,
      complement,
      zipCode,
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
