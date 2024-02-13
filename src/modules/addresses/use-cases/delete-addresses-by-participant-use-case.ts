import { Address } from '@prisma/client';

import { AddressesRepository } from '../repositories/addresses-repository';
import { di } from '@/shared/lib/diContainer';

interface Request {
  participantId: string;
}

export class DeleteAddressesByParticipantUseCase {
  constructor(
    private addressesRepository: AddressesRepository = di.resolve(
      'addressesRepository'
    )
  ) {}

  async execute({ participantId }: Request): Promise<void> {
    const addresses = await this.addressesRepository.findManyByParticipant(
      participantId
    );

    await Promise.all(
      addresses.map(
        async (address) => await this.addressesRepository.delete(address.id)
      )
    );

    return;
  }
}
