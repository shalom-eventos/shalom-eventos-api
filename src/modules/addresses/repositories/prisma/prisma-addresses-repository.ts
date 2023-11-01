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
    const { id, created_at, updated_at, ...dataUpdated } = data;
    const address = await prisma.address.update({
      where: { id: data.id },
      data: dataUpdated,
    });

    return address;
  }

  async findManyByUser(user_id: string) {
    const addresses = await prisma.address.findMany({
      where: { users: { some: { id: user_id } } },
    });

    return addresses;
  }

  async findManyByEvent(event_id: string) {
    const addresses = await prisma.address.findMany({
      where: { events: { some: { id: event_id } } },
    });

    return addresses;
  }

  async findByEvent(address_id: string, event_id: string) {
    const address = await prisma.address.findFirst({
      where: { id: address_id, events: { every: { id: event_id } } },
    });

    return address;
  }

  async delete(id: string) {
    await prisma.address.delete({ where: { id } });
  }
}
