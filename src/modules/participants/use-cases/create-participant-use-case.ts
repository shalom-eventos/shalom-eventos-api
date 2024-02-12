import { Participant } from '@prisma/client';

import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { ParticipantsRepository } from '../repositories/participants-repository';
import {
  ParticipantAlreadyRegisteredError,
  ResourceNotFoundError,
} from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  userId: string;
  fullName: string;
  phoneNumber: string;
  birthdate: Date;
  documentNumber: string;
  documentType: string;
  guardianName?: string;
  guardianPhoneNumber?: string;
  prayerGroup?: string;
  communityType?: string;
  pcdDescription?: string;
  allergyDescription?: string;
  medicationUseDescription?: string;
}

interface Response {
  participant: Participant;
}

export class CreateParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    ),
    private usersRepository: UsersRepository = di.resolve('usersRepository')
  ) {}

  async execute({
    userId,
    fullName,
    phoneNumber,
    birthdate,
    documentNumber,
    documentType,
    guardianName,
    guardianPhoneNumber,
    prayerGroup,
    communityType,
    pcdDescription,
    allergyDescription,
    medicationUseDescription,
  }: Request): Promise<Response> {
    const userExists = await this.usersRepository.findById(userId);
    if (!userExists) throw new ResourceNotFoundError('User');
    if (userExists.role !== 'PARTICIPANT')
      throw new ResourceNotFoundError('User');

    const participantDataExists = await this.participantsRepository.findByUser(
      userId
    );
    if (participantDataExists) throw new ParticipantAlreadyRegisteredError();

    const participant = await this.participantsRepository.create({
      userId,
      fullName,
      phoneNumber,
      birthdate,
      documentNumber,
      documentType,
      guardianName,
      guardianPhoneNumber,
      prayerGroup,
      communityType,
      pcdDescription,
      allergyDescription,
      medicationUseDescription,
    });

    return { participant };
  }
}
