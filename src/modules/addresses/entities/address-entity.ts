import { Address } from '@prisma/client';

export class AddressEntity implements Address {
  id: string;
  city: string;
  complement: string | null;
  district: string;
  state: string;
  street: string;
  street_number: string;
  zip_code: string;

  created_at: Date;
  updated_at: Date;
}
