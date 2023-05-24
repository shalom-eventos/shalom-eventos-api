import { Participant } from '@prisma/client';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { ResourceNotFoundError } from './errors';

interface IRequest {
  user_id: string;
  full_name?: string;
  phone_number?: string;
  birthdate?: Date;
  document_number?: string;
  document_type?: string;
  guardian_name?: string;
  guardian_phone_number?: string;
  prayer_group?: string;
  community_type?: string;
  pcd_description?: string;
  allergy_description?: string;
  medication_use_description?: string;
}

interface IResponse {
  participant: Participant;
}

export class UpdateParticipantUseCase {
  constructor(private participantsRepository: ParticipantsRepository) {}

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
    medication_use_description,
  }: IRequest): Promise<IResponse> {
    const participant = await this.participantsRepository.findByUser(user_id);
    if (!participant) throw new ResourceNotFoundError('Participant');

    if (full_name) participant.full_name = full_name;
    if (phone_number) participant.phone_number = phone_number;
    if (birthdate) participant.birthdate = birthdate;
    if (document_number) participant.document_number = document_number;
    if (document_type) participant.document_type = document_type;
    if (guardian_name) participant.guardian_name = guardian_name;
    if (guardian_phone_number)
      participant.guardian_phone_number = guardian_phone_number;
    if (prayer_group) participant.prayer_group = prayer_group;
    if (community_type) participant.community_type = community_type;
    if (pcd_description) participant.pcd_description = pcd_description;
    if (allergy_description)
      participant.allergy_description = allergy_description;
    if (medication_use_description)
      participant.medication_use_description = medication_use_description;

    await this.participantsRepository.save(participant);

    return { participant };
  }
}
