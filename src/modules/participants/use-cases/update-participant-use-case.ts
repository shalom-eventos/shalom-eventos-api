import { Participant } from '@prisma/client';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { ResourceNotFoundError } from './errors';
import { di } from '@/shared/lib/diContainer';

interface Request {
  userId: string;
  fullName?: string;
  phoneNumber?: string;
  birthdate?: Date;
  documentNumber?: string;
  documentType?: string;
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

export class UpdateParticipantUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository = di.resolve(
      'participantsRepository'
    )
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
    const participant = await this.participantsRepository.findByUser(userId);
    if (!participant) throw new ResourceNotFoundError('Participant');

    if (fullName) participant.fullName = fullName;
    if (phoneNumber) participant.phoneNumber = phoneNumber;
    if (birthdate) participant.birthdate = birthdate;
    if (documentNumber) participant.documentNumber = documentNumber;
    if (documentType) participant.documentType = documentType;
    if (guardianName) participant.guardianName = guardianName;
    if (guardianPhoneNumber)
      participant.guardianPhoneNumber = guardianPhoneNumber;
    if (prayerGroup) participant.prayerGroup = prayerGroup;
    if (communityType) participant.communityType = communityType;
    if (pcdDescription) participant.pcdDescription = pcdDescription;
    if (allergyDescription) participant.allergyDescription = allergyDescription;
    if (medicationUseDescription)
      participant.medicationUseDescription = medicationUseDescription;

    await this.participantsRepository.save(participant);

    return { participant };
  }
}
