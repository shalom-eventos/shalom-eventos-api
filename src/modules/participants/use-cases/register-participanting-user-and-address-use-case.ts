import { hash } from 'bcryptjs';
import { Participant } from '@prisma/client';

import { UsersRepository } from '@/modules/users/repositories/users-repository';

import { ParticipantsRepository } from '../repositories/participants-repository';
import { UserAlreadyExistsError } from './errors';
import { AddressesRepository } from '@/modules/addresses/repositories/addresses-repository';

interface IRequest {
  name: string;
  email: string;
  password: string;

  street: string;
  street_number: string;
  complement?: string;
  zip_code: string;
  district: string;
  city: string;
  state: string;

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
  medication_use_description?: string;
}

interface IResponse {
  participant: Participant;
}

export class RegisterParticipantingUserAndAddressUseCase {
  constructor(
    private participantsRepository: ParticipantsRepository,
    private usersRepository: UsersRepository,
    private addressesRepository: AddressesRepository
  ) {}

  async execute({
    name,
    email,
    password,

    street,
    street_number,
    complement,
    zip_code,
    district,
    city,
    state,

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
    /**
     * START - Create user
     */
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    /**
     * END - create user
     */

    /**
     * START - Create address
     */
    const address = await this.addressesRepository.create({
      street,
      street_number,
      complement,
      zip_code,
      district,
      city,
      state,
      users: {
        connect: {
          id: user.id,
        },
      },
    });

    /**
     * END - Create address
     */

    /**
     * START - Create participant data
     */

    const participant = await this.participantsRepository.create({
      user_id: user.id,
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
    });

    return { participant };
  }
}
