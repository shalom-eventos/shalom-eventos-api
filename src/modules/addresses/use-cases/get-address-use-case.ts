import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  id: string;
}

interface Response {
  address: Address;
}

export class GetAddressUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    )
  ) {}

  async execute({ id }: Request): Promise<Response> {
    const address = await this.addressesRepository.findById(id);

    if (!address) throw new ResourceNotFoundError('Event');

    return { address };
  }
}
