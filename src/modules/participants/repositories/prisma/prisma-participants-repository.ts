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

  async findByUser(user_id: string) {
    const participant = await prisma.participant.findFirst({
      where: { user_id },
    });

    return participant;
  }

  async findManyWithUser() {
    const participants = await prisma.participant.findMany({
      include: { user: true },
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
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const participant = await prisma.participant.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return participant;
  }
}
