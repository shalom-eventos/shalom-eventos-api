import { Prisma, Address } from '@prisma/client';

export interface AddressesRepository {
  findById(id: string): Promise<Address | null>;
  create(data: Prisma.AddressCreateInput): Promise<Address>;
  save(data: Address): Promise<Address>;
  findByEvent(address_id: string, event_id: string): Promise<Address | null>;
  findManyByUser(user_id: string): Promise<Address[]>;
  findManyByEvent(event_id: string): Promise<Address[]>;
}
