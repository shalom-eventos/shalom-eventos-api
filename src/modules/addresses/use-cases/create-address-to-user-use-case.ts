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

export class CreateAddressToUserUseCase {
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
    const user = await this.usersRepository.findByIdWithRelations(userId);

    if (!user) throw new ResourceNotFoundError('User');

    if (user.role !== 'PARTICIPANT') throw new UserIsNotParticipantError();

    if (user?.addresses && user.addresses.length > 0)
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
          id: user.id,
        },
      },
    });

    return { address };
  }
}
