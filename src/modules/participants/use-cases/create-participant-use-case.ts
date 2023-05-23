import { Participant } from '@prisma/client';

import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { ParticipantsRepository } from '../repositories/participants-repository';
import {
  ParticipantAlreadyRegisteredError,
  ResourceNotFoundError,
} from './errors';

interface IRequest {
  user_id: string;
  full_name: string;
  phone_number: string;
  birthdate: Date;
  document_number: string;
  document_type: string;
  guardian_name?: string;
  guardian_phone_number?: string;
  prayer_group?: string;
  community_type?: string;
  pcd_description?: string;
  allergy_description?: string;
}

interface IResponse {
  participant: Participant;
}

export class CreateParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    user_id,
    full_name,
    phone_number,
    birthdate,
    document_number,
    document_type,
    guardian_name,
    guardian_phone_number,
    prayer_group,
    community_type,
    pcd_description,
    allergy_description,
  }: IRequest): Promise<IResponse> {
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists) throw new ResourceNotFoundError('User');
    if (userExists.role !== 'PARTICIPANT')
      throw new ResourceNotFoundError('User');

    const participantDataExists = await this.participantsRepository.findByUser(
      user_id
    );
    if (participantDataExists) throw new ParticipantAlreadyRegisteredError();

    const participant = await this.participantsRepository.create({
      user_id,
      full_name,
      phone_number,
      birthdate,
      document_number,
      document_type,
      guardian_name,
      guardian_phone_number,
      prayer_group,
      community_type,
      pcd_description,
      allergy_description,
    });

    return { participant };
  }
}
