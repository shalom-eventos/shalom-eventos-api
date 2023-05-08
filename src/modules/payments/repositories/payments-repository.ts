import { Prisma, Payment } from '@prisma/client';

export interface PaymentsRepository {
  findById(id: string): Promise<Payment | null>;
  create(data: Prisma.PaymentUncheckedCreateInput): Promise<Payment>;
  save(data: Payment): Promise<Payment>;
}
