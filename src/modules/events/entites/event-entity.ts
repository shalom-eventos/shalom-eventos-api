import { AddressEntity } from '@/modules/addresses/entities/address-entity';
import { Event } from '@prisma/client';

export class EventEntity implements Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;

  addresses?: AddressEntity[];
}
