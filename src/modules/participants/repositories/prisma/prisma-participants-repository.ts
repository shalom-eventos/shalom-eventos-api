import { prisma } from '@/shared/lib/prisma';
import { Prisma, Participant } from '@prisma/client';

import { ParticipantsRepository } from './../participants-repository';

export class PrismaParticipantsRepository implements ParticipantsRepository {
  async findById(id: string) {
    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    return participant;
  }

  async findByUser(userId: string) {
    const participant = await prisma.participant.findFirst({
      where: { userId },
    });

    return participant;
  }

  async findManyWithAddresses() {
    const participants = await prisma.participant.findMany({
      include: {
        addresses: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            addresses: true,
          },
        },
      },
    });

    return participants;
  }

  async create(data: Prisma.ParticipantUncheckedCreateInput) {
    const participant = await prisma.participant.create({
      data,
    });

    return participant;
  }

  async save(data: Participant) {
    const { id, createdAt, updatedAt, ...dataUpdated } = data;
    const participant = await prisma.participant.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return participant;
  }

  async delete(id: string) {
    await prisma.participant.delete({ where: { id } });
  }
}
