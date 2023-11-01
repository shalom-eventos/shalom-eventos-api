import { Prisma, Participant, User, Address } from '@prisma/client';

export type ParticipantWithRelationsType = Participant & {
  addresses: Address[];
};

export interface ParticipantsRepository {
  findById(id: string): Promise<Participant | null>;
  findByUser(user_id: string): Promise<Participant | null>;
  findManyWithAddresses(): Promise<ParticipantWithRelationsType[]>;
  create(data: Prisma.ParticipantUncheckedCreateInput): Promise<Participant>;
  save(data: Participant): Promise<Participant>;
  delete(id: string): Promise<void>;
}
