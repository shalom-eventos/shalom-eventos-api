import { FastifyRequest, FastifyReply } from 'fastify';
import dayjs from 'dayjs';
import { z } from 'zod';
import * as XLSX from 'xlsx';

import { translatePaymentStatus } from '@/shared/utils/translate-payment-status';
import { makeListRegistrationsByEventUseCase } from '../../use-cases/factories/make-list-registrations-by-event-use-case';

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

    // Create a workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);

    // Add headers to the worksheet
    const headers = [
      'Data de Inscrição',
      'Nome Completo',
      'Nome para Crachá',
      'Email',
      'Whatsapp',
      'Idade',
      'Documento',
      'Tipo de Documento',
      'Data de Nascimento',
      'Cidade',
      'Endereço Completo',
      'Grupo de Oração',
      'PCD',
      'Alergia (Médica ou Alimentar)',
      "Já Participou de Algum ACAMP'S?",
      'Faz Uso de Alguma Medicação?',
      'Comprovante de Pagamento',
      'Transporte Próprio ou Ônibus',
      'Forma de Pagamento',
      'Valor',
      'Lote',
      'Status',
    ];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

    // Add data to the worksheet
    registrations.forEach((registration) => {
      const participantData = registration?.participant;

      let addressData;
      let fullAddress;
      if (registration?.participant?.addresses?.length > 0) {
        addressData = registration?.participant?.addresses[0];
      } else if (
        registration?.participant?.user?.addresses &&
        registration?.participant?.user?.addresses?.length > 0
      ) {
        addressData = registration?.participant?.user?.addresses[0];
      }

      if (addressData) {
        fullAddress = `${addressData.street}, nº ${
          addressData.street_number
        }, ${addressData.complement ? addressData.complement + ', ' : ''}${
          addressData.district
        }, ${addressData.city} - ${addressData.state}, CEP: ${
          addressData.zip_code
        }`;
      }

      const rowData = [
        dayjs(registration.created_at).format('DD/MM/YYYY HH:mm'),
        participantData.full_name,
        registration.credential_name,
        participantData.email,
        participantData.phone_number,
        participantData?.birthdate
          ? dayjs(new Date()).diff(participantData?.birthdate, 'years')
          : '-',
        participantData.document_number,
        participantData.document_type,
        dayjs(participantData?.birthdate).format('DD/MM/YYYY'),
        addressData?.city ?? '-',
        fullAddress,
        participantData.prayer_group ?? '-',
        participantData.pcd_description ?? 'Não',
        participantData.allergy_description ?? 'Não',
        registration.has_participated_previously ? 'Sim' : 'Não',
        participantData.medication_use_description ?? 'Não',
        `https://api.shalomsobral.com.br/files/${registration.payment?.file}`,
        registration.transportation_mode,
        registration.payment?.payment_method,
        registration.payment?.price,
        '1º Lote', //registration.payment?.event_ticket_id,
        translatePaymentStatus(registration.payment?.status),
      ];

      XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 });
    });

    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    // Write the workbook to a buffer
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set the response headers for Excel download
    reply
      .header(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      .header('Content-Disposition', 'attachment; filename=participants.xlsx')
      .send(buf);

    return reply;
  } catch (error) {
    reply.status(500).send(error);
  }
}
