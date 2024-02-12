import { Address } from '@prisma/client';

import { di } from '@/shared/lib/diContainer';
import { AddressesRepository } from '../repositories/addresses-repository';

interface Request {
  eventId: string;
}

interface Response {
  addresses: Address[];
}

export class ListAddressesByEventUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    )
  ) {}

  async execute({ eventId }: Request): Promise<Response> {
    const addresses = await this.addressesRepository.findManyByEvent(eventId);

    return { addresses };
  }
}
