import { prisma } from '@/shared/lib/prisma';
import { Prisma, EventRegistration } from '@prisma/client';

import { RegistrationsRepository } from './../registrations-repository';

export class PrismaRegistrationsRepository implements RegistrationsRepository {
  async findById(id: string) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
    });

    return registration;
  }

  async findByEventAndUser(event_id: string, user_id: string) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { event_id, user_id },
    });

    return registration;
  }

  async findByIdAndUser(id: string, user_id: string) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { id, user_id },
    });

    return registration;
  }

  async findManyByEvent(event_id: string) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { event_id },
      include: {
        user: { select: { email: true, participant: true, addresses: true } },
        payment: true,
        event: { include: { addresses: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return registrations;
  }

  async findManyByUser(user_id: string) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { user_id },
      include: {
        user: {
          select: { email: true, participant: true },
        },
        event: { include: { addresses: true } },
        payment: true,
      },
    });

    return registrations;
  }

  async create(data: Prisma.EventRegistrationUncheckedCreateInput) {
    const registration = await prisma.eventRegistration.create({
      data,
    });

    return registration;
  }

  async save(data: EventRegistration) {
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const registration = await prisma.eventRegistration.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return registration;
  }
}
