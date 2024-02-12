import { User } from '@prisma/client';

import { UsersRepository } from '@modules/users/repositories/users-repository';
import { di } from '@/shared/lib/diContainer';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

interface IGetUserProfileUseCaseRequest {
  userId: string;
}

interface IGetUserProfileUseCaseResponse {
  user: User;
}

export class GetUserProfileUseCase {
  constructor(
    private usersRepository: UsersRepository = di.resolve('usersRepository')
  ) {}

  async execute({
    userId,
  }: IGetUserProfileUseCaseRequest): Promise<IGetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    return { user };
  }
}
