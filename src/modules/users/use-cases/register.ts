import { hash } from 'bcryptjs';

import { UsersRepository } from '@modules/users/repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';
import { di } from '@/shared/lib/diContainer';

interface Request {
  name: string;
  email: string;
  password: string;
}

interface Response {
  user: User;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository = di.resolve('usersRepository')
  ) {}

  async execute({ name, email, password }: Request): Promise<Response> {
    const passwordHash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    });

    return { user };
  }
}
