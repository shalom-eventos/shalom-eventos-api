import { Address, Prisma, User } from '@prisma/client';

type UserWithRelationsType = User & {
  addresses: Address[];
};
export interface UsersRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByIdWithRelations(id: string): Promise<UserWithRelationsType | null>;
}
