import { prisma } from '@/shared/lib/prisma';
import { Prisma, Payment } from '@prisma/client';

import { PaymentsRepository } from './../payments-repository';

export class PrismaPaymentsRepository implements PaymentsRepository {
  async findById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    return payment;
  }

  async create(data: Prisma.PaymentUncheckedCreateInput) {
    const payment = await prisma.payment.create({
      data,
    });

    return payment;
  }

  async save(data: Payment) {
    const payment = await prisma.payment.update({
      where: { id: data.id },
      data,
    });

    return payment;
  }
}
