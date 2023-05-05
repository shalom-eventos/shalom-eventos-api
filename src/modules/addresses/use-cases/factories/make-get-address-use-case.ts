import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { GetAddressUseCase } from '../get-address-use-case';

export function makeGetAddressEventUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new GetAddressUseCase(addressesRepository);

  return useCase;
}
