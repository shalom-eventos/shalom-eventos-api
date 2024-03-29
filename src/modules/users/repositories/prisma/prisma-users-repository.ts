import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './../users-repository';

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { participant: true },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByIdWithRelations(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });

    return user;
  }
}
