import { Address } from '@prisma/client';

export class AddressEntity implements Address {
  id: string;
  city: string;
  complement: string | null;
  district: string;
  state: string;
  street: string;
  streetNumber: string;
  zipCode: string;

  createdAt: Date;
  updatedAt: Date;
}
