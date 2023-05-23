import { FastifyRequest, FastifyReply } from 'fastify';
import * as csv from 'fast-csv';
import dayjs from 'dayjs';
import { z } from 'zod';

import { makeListRegistrationsByEventUseCase } from '../../use-cases/factories/make-list-registrations-by-event-use-case';
import { translatePaymentStatus } from '@/shared/utils/translate-payment-status';

export async function exportRegistrationsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z
    .object({
      event_id: z.string().uuid(),
    })
    .strict();

  const { event_id } = paramsSchema.parse(request.params);

  try {
    const listRegistrations = makeListRegistrationsByEventUseCase();

    const { registrations } = await listRegistrations.execute({ event_id });

    // Create a CSV stream writer
    const csvStream = csv.format({ headers: true });

    // Write each user as a CSV row
    registrations.forEach((registration) => {
      const participantData = registration?.user?.participant;
      csvStream.write({
        Evento: registration?.event?.title ?? '-',
        NomeCompleto: participantData?.full_name,
        NomeCredencial: registration.credential_name,
        Email: registration?.user?.email,
        Telefone: participantData?.phone_number,
        NumeroDocumento: participantData?.document_number,
        TipoDocumento: participantData?.document_type,
        DataNascimento: participantData?.birthdate
          ? dayjs(participantData?.birthdate).format('DD/MM/YYYY')
          : '-',
        Idade: participantData?.birthdate
          ? dayjs(new Date()).diff(participantData?.birthdate, 'years')
          : '-',
        NomeResponsavel: participantData?.guardian_name,
        TelefoneResponsavel: participantData?.guardian_phone_number,
        GrupoOracao: participantData?.prayer_group,
        TipoComunidade: participantData?.community_type,
        PCD: participantData?.pcd_description,
        Alergias: participantData?.allergy_description,
        MeioDeTransporte: registration.transportation_mode,
        ComoSoubeDoEvento: registration.event_source,
        InscricaoAprovada: registration.is_approved ? 'Sim' : 'Não',
        ComprovantePagamento: translatePaymentStatus(
          registration.payment?.status
        ),
        CheckIn: registration.checked_in ? 'Sim' : 'Não',
      });
    });

    // End the CSV stream
    csvStream.end();

    // Set the response headers for CSV download
    reply.header('Content-Type', 'text/csv');
    reply.header(
      'Content-Disposition',
      'attachment; filename=participants.csv'
    );

    // Send the CSV data as the response
    reply.send(csvStream);

    return reply;
  } catch (error) {
    reply.status(500).send(error);
  }
}
