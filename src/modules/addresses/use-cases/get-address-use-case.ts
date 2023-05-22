import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  id: string;
}

interface IResponse {
  address: Address;
}

export class GetAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({ id }: IRequest): Promise<IResponse> {
    const address = await this.addressesRepository.findById(id);

    if (!address) throw new ResourceNotFoundError('Event');

    return { address };
  }
}
