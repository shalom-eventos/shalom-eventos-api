import { AddressEntity } from '@/modules/addresses/entities/address-entity';
import { Event } from '@prisma/client';

export class EventEntity implements Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  addresses?: AddressEntity[];
}
