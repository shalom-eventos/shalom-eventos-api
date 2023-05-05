import { Prisma, Address } from '@prisma/client';

export interface AddressesRepository {
  findById(id: string): Promise<Address | null>;
  create(data: Prisma.AddressCreateInput): Promise<Address>;
  save(data: Address): Promise<Address>;
}
