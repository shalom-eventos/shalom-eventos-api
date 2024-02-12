import { Prisma, Address } from '@prisma/client';

export interface AddressesRepository {
  findById(id: string): Promise<Address | null>;
  create(data: Prisma.AddressCreateInput): Promise<Address>;
  save(data: Address): Promise<Address>;
  findByEvent(addressId: string, eventId: string): Promise<Address | null>;
  findManyByUser(userId: string): Promise<Address[]>;
  findManyByEvent(eventId: string): Promise<Address[]>;
  delete(id: string): Promise<void>;
}
