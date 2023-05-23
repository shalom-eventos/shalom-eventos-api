import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';

interface IRequest {
  event_id: string;
}

interface IResponse {
  addresses: Address[];
}

export class ListAddressesByEventUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({ event_id }: IRequest): Promise<IResponse> {
    const addresses = await this.addressesRepository.findManyByEvent(event_id);

    return { addresses };
  }
}
