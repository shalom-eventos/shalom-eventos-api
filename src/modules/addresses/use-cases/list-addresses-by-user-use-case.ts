import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { di } from '@/shared/lib/diContainer';

interface Request {
  userId: string;
}

interface Response {
  addresses: Address[];
}

export class ListAddressesByUserUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    )
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const addresses = await this.addressesRepository.findManyByUser(userId);

    return { addresses };
  }
}
