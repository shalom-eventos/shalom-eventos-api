import { prisma } from '@/shared/lib/prisma';
import { Prisma, EventRegistration } from '@prisma/client';

import { RegistrationsRepository } from './../registrations-repository';
import { FilterRegistrationsDto } from '../../dtos/filter-registrations-dto';

export class PrismaRegistrationsRepository implements RegistrationsRepository {
  async create(data: Prisma.EventRegistrationUncheckedCreateInput) {
    const registration = await prisma.eventRegistration.create({
      data,
    });

    return registration;
  }

  async save(data: EventRegistration) {
    const { id, createdAt, updatedAt, ...dataUpdated } = data;
    const registration = await prisma.eventRegistration.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return registration;
  }

  async findOneById(id: string) {
    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
    });

    return registration;
  }

  async findOneByEventAndUser(eventId: string, userId: string) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { eventId, participant: { userId } },
    });

    return registration;
  }

  async findOneByIdAndUser(id: string, userId: string) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { id, participant: { userId } },
    });

    return registration;
  }

  async findManyByEvent(eventId: string, filter?: FilterRegistrationsDto) {
    const type = filter?.type;
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId, type },
      include: {
        participant: {
          include: {
            addresses: true,
            user: {
              select: {
                email: true,
                addresses: true,
              },
            },
          },
        },
        payment: true,
        event: { include: { addresses: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return registrations;
  }

  async findManyByUser(userId: string) {
    const registrations = await prisma.eventRegistration.findMany({
      where: { participant: { userId } },
      include: {
        participant: {
          include: {
            user: {
              select: { email: true, addresses: true },
            },
          },
        },
        event: { include: { addresses: true } },
        payment: true,
      },
    });

    return registrations;
  }

  async findOneByParticipantEmailAndEvent(email: string, eventId: string) {
    const registration = await prisma.eventRegistration.findFirst({
      where: { eventId, participant: { email } },
    });

    return registration;
  }

  async delete(id: string) {
    await prisma.eventRegistration.delete({ where: { id } });
  }
}
