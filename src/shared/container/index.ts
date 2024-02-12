import { asClass, Lifetime } from 'awilix';
import { di } from '@/shared/lib/diContainer';
import { PrismaUsersRepository } from '@/modules/users/repositories/prisma/prisma-users-repository';

di.register({
  usersRepository: asClass(PrismaUsersRepository, {
    lifetime: Lifetime.SINGLETON,
  }),
});
