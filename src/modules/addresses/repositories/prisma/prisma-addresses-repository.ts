import { prisma } from '@/shared/lib/prisma';
import { Prisma, Address } from '@prisma/client';
import { AddressesRepository } from './../addresses-repository';

export class PrismaAddressesRepository implements AddressesRepository {
  async findById(id: string) {
    const address = await prisma.address.findFirst({
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
    const { id, createdAt, updatedAt, ...dataUpdated } = data;
    const address = await prisma.address.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return address;
  }

  async findManyByUser(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { users: { some: { id: userId } } },
    });

    return addresses;
  }

  async findManyByEvent(eventId: string) {
    const addresses = await prisma.address.findMany({
      where: { events: { some: { id: eventId } } },
    });

    return addresses;
  }

  async findByEvent(addressId: string, eventId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, events: { every: { id: eventId } } },
    });

    return address;
  }

  async delete(id: string) {
    await prisma.address.delete({ where: { id } });
  }
}
