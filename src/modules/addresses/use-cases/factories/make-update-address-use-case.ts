import { PrismaAddressesRepository } from '../../repositories/prisma/prisma-addresses-repository';
import { UpdateAddressUseCase } from '../update-address-use-case';

export function makeUpdateAddressUseCase() {
  const addressesRepository = new PrismaAddressesRepository();
  const useCase = new UpdateAddressUseCase(addressesRepository);

  return useCase;
}
