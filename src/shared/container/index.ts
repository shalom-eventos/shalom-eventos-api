import { asClass, Lifetime } from 'awilix';
import { di } from '@/shared/lib/diContainer';
import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';
import { PrismaEventsRepository } from '@/modules/events/repositories/prisma/prisma-events-repository';

di.register({
  usersRepository: asClass(PrismaUsersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
  eventsRepository: asClass(PrismaEventsRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
});
