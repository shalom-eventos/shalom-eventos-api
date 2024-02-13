import { Prisma, Payment } from '@prisma/client';

export interface PaymentsRepository {
  findOneById(id: string): Promise<Payment | null>;
  create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>;
  save(data: Payment): Promise<Payment>;
  delete(id: string): Promise<void>;
  findOneByRegistrationId(registrationId: string): Promise<Payment | null>;
}
