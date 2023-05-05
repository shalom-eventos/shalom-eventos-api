import { prisma } from '@/shared/lib/prisma';
import { Prisma, Address } from '@prisma/client';
import { AddressesRepository } from './../addresses-repository';

export class PrismaAddressesRepository implements AddressesRepository {
  async findById(id: string) {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    return address;
  }

  async create(data: Prisma.AddressCreateInput) {
    const address = await prisma.address.create({
      data,
    });

    return address;
  }

  async save(data: Address) {
    const address = await prisma.address.update({
      where: { id: data.id },
      data,
    });

    return address;
  }
}
