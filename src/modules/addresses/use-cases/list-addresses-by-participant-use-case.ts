import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';

interface IRequest {
  user_id: string;
}

interface IResponse {
  addresses: Address[];
}

export class ListAddressesByParticipantUseCase {
  constructor(private addressesRepository: AddressesRepository) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const addresses = await this.addressesRepository.findManyByUser(user_id);

    return { addresses };
  }
}
